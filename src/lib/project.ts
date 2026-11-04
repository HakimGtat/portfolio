import { getEntry, type CollectionEntry } from 'astro:content';
import { codeToHtml } from 'shiki';
import { lineCount, readSourceFile, sourceUrl } from './source';
import { validateSteps } from './validate';
import { formatNote } from './notes';

export interface CodeFile {
  path: string;
  label: string;
  html: string;
  lines: number;
  url?: string;
}

export interface WalkStep {
  title: string;
  file: string;
  start: number;
  end: number;
  noteHtml: string;
}

export interface ProjectView {
  files: CodeFile[];
  overviewHtml: string | null;
  steps: WalkStep[];
  reviewed: boolean;
}

const LANGS: Record<string, string> = {
  ts: 'ts', tsx: 'tsx', js: 'js', mjs: 'js', jsx: 'jsx', astro: 'astro', css: 'css', json: 'json',
  c: 'c', h: 'c', cpp: 'cpp', cc: 'cpp', hpp: 'cpp', py: 'python', sv: 'systemverilog',
  v: 'verilog', md: 'md', mdx: 'mdx', sh: 'bash', yml: 'yaml', yaml: 'yaml',
};

function langFor(path: string): string {
  return LANGS[path.split('.').pop()?.toLowerCase() ?? ''] ?? 'text';
}

// firstLine lets an excerpt keep the real line numbers of the file it came from.
export async function highlight(code: string, path: string, firstLine = 1): Promise<string> {
  return codeToHtml(code.replace(/\n$/, ''), {
    lang: langFor(path),
    themes: { light: 'github-light', dark: 'github-dark-dimmed' },
    defaultColor: false,
    transformers: [
      {
        line(node, line) {
          node.properties['data-line'] = line + firstLine - 1;
        },
      },
    ],
  });
}

export async function loadProjectView(project: CollectionEntry<'projects'>): Promise<ProjectView> {
  const { repo, commit } = project.data;

  const files = await Promise.all(
    project.data.files.map(async ({ path, label }) => {
      const code = await readSourceFile(repo, commit, path);
      return {
        path,
        label: label ?? path.split('/').pop()!,
        html: await highlight(code, path),
        lines: lineCount(code),
        url: sourceUrl(repo, commit, path),
      };
    }),
  );

  const explanation = await getEntry('explanations', project.id);
  if (!explanation) return { files, overviewHtml: null, steps: [], reviewed: false };

  const { data } = explanation;
  const where = `src/content/explanations/${project.id}.json`;
  const errors = validateSteps(
    data.steps,
    new Map(files.map((f) => [f.path, f.lines])),
    data.commit,
    commit,
  );
  if (errors.length) {
    throw new Error(`Explanation check failed for ${where}:\n  - ${errors.join('\n  - ')}`);
  }
  if (!data.reviewed) {
    const msg = `${where} is an unreviewed AI draft. Read it, fix it, then set "reviewed": true.`;
    if (import.meta.env.PROD) throw new Error(msg);
    console.warn(`[explain] ${msg}`);
  }

  const unknown = new Set<string>();
  const view: ProjectView = {
    files,
    overviewHtml: formatNote(data.overview, unknown),
    steps: data.steps.map((s) => ({
      title: s.title,
      file: s.file,
      start: s.lines[0],
      end: s.lines[1],
      noteHtml: formatNote(s.note, unknown),
    })),
    reviewed: data.reviewed,
  };
  if (unknown.size) {
    console.warn(`[explain] ${where} uses glossary terms with no definition: ${[...unknown].join(', ')}`);
  }
  return view;
}
