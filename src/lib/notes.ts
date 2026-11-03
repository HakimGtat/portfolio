// Tiny formatter for explanation text: paragraphs, `code`, **bold**, *italic* and
// [[glossary term]] / [[term|shown text]]. Kept deliberately small so AI drafts stay plain.
import { lookupTerm } from '../data/glossary';

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function formatNote(text: string, unknownTerms: Set<string> = new Set()): string {
  return text
    .trim()
    .split(/\n\s*\n/)
    .map((para) => `<p>${formatInline(para.trim(), unknownTerms)}</p>`)
    .join('');
}

function formatInline(text: string, unknownTerms: Set<string>): string {
  const codes: string[] = [];
  let out = escape(text).replace(/`([^`]+)`/g, (_, code: string) => {
    codes.push(`<code>${code}</code>`);
    return `\u0000${codes.length - 1}\u0000`;
  });

  out = out
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, term: string, shown?: string) => {
      const def = lookupTerm(term.trim());
      const label = shown ?? term;
      if (!def) {
        unknownTerms.add(term.trim());
        return label;
      }
      return `<span class="gloss" tabindex="0" data-def="${escape(def)}">${label}</span>`;
    });

  return out.replace(/\u0000(\d+)\u0000/g, (_, i: string) => codes[Number(i)]);
}
