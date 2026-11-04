import { useEffect, useRef, useState } from 'react';
import type { CodeFile, WalkStep } from '../../lib/project';
import './explorer.css';

interface Props {
  files: CodeFile[];
  steps: WalkStep[];
  repoUrl?: string;
}

export default function ProjectExplorer({ files, steps, repoUrl }: Props) {
  const [fileIndex, setFileIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);

  const file = files[fileIndex];
  const step = open && stepIndex !== null ? steps[stepIndex] : null;
  const hasSteps = steps.length > 0;

  function goToStep(i: number) {
    const target = steps[i];
    const fi = files.findIndex((f) => f.path === target.file);
    if (fi >= 0) setFileIndex(fi);
    setStepIndex(i);
  }

  function toggle() {
    const next = !open;
    setOpen(next);
    if (next && stepIndex === null && hasSteps) goToStep(0);
    // On phones the panel is a bottom sheet, so park the code at the top of the screen above it.
    // Instant, because a smooth page scroll gets cancelled by the code box's own smooth scroll.
    if (next && rootRef.current && matchMedia('(max-width: 860px)').matches) {
      const top = rootRef.current.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: 'instant' });
    }
  }

  // Highlight the active step's lines and bring them into view.
  useEffect(() => {
    const root = codeRef.current;
    if (!root) return;
    const lines = root.querySelectorAll<HTMLElement>('.line');
    const active = step && step.file === file.path ? step : null;
    lines.forEach((el) => {
      const n = Number(el.dataset.line);
      const inRange = !!active && n >= active.start && n <= active.end;
      el.classList.toggle('hl', inRange);
      el.classList.toggle('hl-start', inRange && n === active!.start);
      el.classList.toggle('hl-end', inRange && n === active!.end);
      el.classList.toggle('dim', !!active && !inRange);
    });
    if (active) {
      const first = root.querySelector<HTMLElement>(`.line[data-line="${active.start}"]`);
      if (first) {
        root.scrollTo({ top: Math.max(0, first.offsetTop - 48), behavior: 'smooth' });
      }
    }
  }, [step, file]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div ref={rootRef} className={`explorer${open ? ' is-open' : ''}`}>
      <div className="explorer-bar">
        <div className="file-tabs" role="tablist" aria-label="Source files">
          {files.map((f, i) => (
            <button
              key={f.path}
              role="tab"
              aria-selected={i === fileIndex}
              className="file-tab"
              title={f.path}
              onClick={() => setFileIndex(i)}
            >
              {f.label}
            </button>
          ))}
        </div>
        {hasSteps && (
          <button
            className="explain-toggle"
            aria-expanded={open}
            aria-controls="explain-panel"
            onClick={toggle}
          >
            <Icon name="pen" className="explain-icon" />
            {open ? 'Hide explanation' : 'Explain this'}
          </button>
        )}
      </div>

      <div className="explorer-body">
        <div className="code-pane">
          <div className="code-path">
            <span>{file.path}</span>
            {file.url && (
              <a href={file.url} target="_blank" rel="noreferrer">
                View on GitHub <Icon name="external" />
              </a>
            )}
          </div>
          <div
            ref={codeRef}
            className="code-scroll"
            dangerouslySetInnerHTML={{ __html: file.html }}
          />
        </div>

        {open && hasSteps && (
          <aside id="explain-panel" className="explain-panel" aria-label="Walkthrough">
            <div className="panel-head">
              <span className="hand panel-title">walkthrough</span>
              <span className="panel-count">
                {stepIndex !== null ? stepIndex + 1 : 0}/{steps.length}
              </span>
              <button className="panel-close" aria-label="Close explanation" onClick={() => setOpen(false)}>
                <Icon name="close" />
              </button>
            </div>
            <ol className="steps">
              {steps.map((s, i) => (
                <li key={i} className={`step${i === stepIndex ? ' is-active' : ''}`}>
                  <button className="step-head" onClick={() => goToStep(i)} aria-current={i === stepIndex}>
                    <span className="step-num">{i + 1}</span>
                    <span className="step-title">{s.title}</span>
                    <span className="step-lines">
                      {s.file.split('/').pop()} · L{s.start}–{s.end}
                    </span>
                  </button>
                  {i === stepIndex && (
                    <div className="note">
                      <svg className="note-arrow" viewBox="0 0 60 40" aria-hidden="true">
                        <path d="M58 30 C 40 34, 22 30, 8 14" />
                        <path d="M6 24 L 7 13 L 17 15" />
                      </svg>
                      <div className="note-body" dangerouslySetInnerHTML={{ __html: s.noteHtml }} />
                    </div>
                  )}
                </li>
              ))}
            </ol>
            <div className="panel-nav">
              <button
                disabled={stepIndex === null || stepIndex === 0}
                onClick={() => stepIndex !== null && goToStep(stepIndex - 1)}
              >
                <Icon name="left" /> Prev
              </button>
              <button
                disabled={stepIndex === null || stepIndex === steps.length - 1}
                onClick={() => stepIndex !== null && goToStep(stepIndex + 1)}
              >
                Next <Icon name="right" />
              </button>
            </div>
          </aside>
        )}
      </div>

      {repoUrl && (
        <p className="explorer-foot">
          Showing key files only.{' '}
          <a href={repoUrl}>
            Browse the full repo on GitHub <Icon name="external" />
          </a>
        </p>
      )}
    </div>
  );
}

const ICON_PATHS: Record<string, string> = {
  pen: 'M4 20h4L19 9l-4-4L4 16v4zM14 6l4 4',
  external: 'M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5',
  close: 'M6 6l12 12M18 6L6 18',
  left: 'M15 6l-6 6 6 6',
  right: 'M9 6l6 6-6 6',
};

function Icon({ name, className = '' }: { name: keyof typeof ICON_PATHS; className?: string }) {
  return (
    <svg
      className={`icon ${className}`}
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={ICON_PATHS[name]} />
    </svg>
  );
}
