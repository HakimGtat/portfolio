// Drafts a plain-English explanation for one project with Claude.
//
//   npm run explain <slug>            write src/content/explanations/<slug>.json (reviewed: false)
//   npm run explain <slug> -- --force overwrite a draft you already marked as reviewed
//
// The draft is a starting point: read it, fix it, then set "reviewed": true. Production builds refuse
// unreviewed drafts and any step whose line range doesn't exist at the pinned commit.
import Anthropic from '@anthropic-ai/sdk';
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { z } from 'zod';
import { lineCount, readSourceFile } from '../src/lib/source.ts';
import { validateSteps } from '../src/lib/validate.ts';
import { glossary } from '../src/data/glossary.ts';

const MODEL = 'claude-sonnet-5-5';

const ExplanationSchema = z.object({
  overview: z.string().describe('2-3 short paragraphs: what the project does and how the pieces fit together.'),
  steps: z
    .array(
      z.object({
        title: z.string().describe('Short heading for this step, under 60 characters.'),
        file: z.string().describe('Exact file path as given in the input.'),
        start: z.number().int().describe('First line of the highlighted range (1-based).'),
        end: z.number().int().describe('Last line of the highlighted range (inclusive).'),
        note: z.string().describe('The explanation for this range, 1-2 short paragraphs.'),
      }),
    )
    .describe('2 to 4 walkthrough steps covering the most interesting parts of the code.'),
});

const SYSTEM = `You write code walkthroughs for an engineer's portfolio site.

The reader has roughly first-year programming knowledge: they know variables, functions, loops, and what memory and a network are. Many readers are recruiters or engineers from other fields. Explain what the code does and why it is built that way, in plain English, without talking down to them.

Rules:
- Write in first person as the author ("I", "my"), warm and direct, with normal capitalization. No hype words.
- Each walkthrough step must point at one specific line range of one file. Use the line numbers shown in the input exactly. Pick ranges of roughly 5-40 lines that a reader can take in at once.
- Pick 2-4 steps that tell the story of the project in order. Skip boilerplate, imports and config.
- Never state results, metrics, performance numbers or outcomes. The author adds those separately. Describe mechanisms only.
- When you use a jargon term from the glossary list, mark its first use as [[term]] or [[term|shown text]]. Do not invent glossary terms; explain any other jargon inline in a few words.
- Formatting available: blank-line paragraphs, \`inline code\`, **bold**, *italic*. Nothing else (no headings, lists or links).`;

async function main() {
  const args = process.argv.slice(2);
  const slug = args.find((a) => !a.startsWith('--'));
  const force = args.includes('--force');
  if (!slug) {
    console.error('Usage: npm run explain <project-slug>');
    process.exit(1);
  }

  const projectPath = join('src', 'content', 'projects', `${slug}.mdx`);
  const outPath = join('src', 'content', 'explanations', `${slug}.json`);

  const mdx = await readFile(projectPath, 'utf8').catch(() => {
    throw new Error(`No project file at ${projectPath}`);
  });
  const fm = parseYaml(mdx.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '') as {
    title: string;
    summary: string;
    repo: string;
    commit: string;
    files: { path: string }[];
  };

  const existing = await readFile(outPath, 'utf8').then(JSON.parse).catch(() => null);
  if (existing?.reviewed && !force) {
    throw new Error(`${outPath} is already reviewed. Pass --force to overwrite it.`);
  }

  console.log(`Reading ${fm.files.length} file(s) from ${fm.repo} @ ${fm.commit.slice(0, 12)}…`);
  const files = await Promise.all(
    fm.files.map(async ({ path }) => ({ path, code: await readSourceFile(fm.repo, fm.commit, path) })),
  );
  const lineCounts = new Map(files.map((f) => [f.path, lineCount(f.code)]));

  const numbered = files
    .map((f) => {
      const body = f.code
        .replace(/\n$/, '')
        .split('\n')
        .map((line, i) => `${String(i + 1).padStart(4)}| ${line}`)
        .join('\n');
      return `<file path="${f.path}">\n${body}\n</file>`;
    })
    .join('\n\n');

  const prompt = `Project: ${fm.title}
Summary: ${fm.summary}

Glossary terms you may mark with [[term]]: ${Object.keys(glossary).join(', ')}

Source files (each line is prefixed with its line number):

${numbered}`;

  const client = new Anthropic();
  console.log(`Asking ${MODEL} for a draft…`);
  const response = await client.beta.messages.parse({
    model: MODEL,
    max_tokens: 16000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    system: SYSTEM,
    messages: [{ role: 'user', content: prompt }],
    output_config: { format: betaZodOutputFormat(ExplanationSchema) },
  });

  if (response.stop_reason === 'refusal') {
    throw new Error(`The model declined: ${response.stop_details?.explanation ?? 'no reason given'}`);
  }
  const draft = response.parsed_output;
  if (!draft) throw new Error(`No parseable output (stop_reason: ${response.stop_reason}).`);

  const steps = draft.steps.map((s) => ({
    title: s.title,
    file: s.file,
    lines: [s.start, s.end] as [number, number],
    note: s.note,
  }));
  const errors = validateSteps(steps, lineCounts, fm.commit, fm.commit);

  await writeFile(
    outPath,
    JSON.stringify(
      { reviewed: false, model: response.model, commit: fm.commit, overview: draft.overview, steps },
      null,
      2,
    ) + '\n',
  );

  console.log(`\nWrote ${outPath} (${steps.length} steps).`);
  if (errors.length) {
    console.warn(`\nFix these before building:\n  - ${errors.join('\n  - ')}`);
  }
  console.log('Review the draft, edit anything that is wrong, then set "reviewed": true.');
}

main().catch((err) => {
  if (err instanceof Anthropic.AuthenticationError) {
    console.error('Authentication failed. Put ANTHROPIC_API_KEY in .env (see .env.example).');
  } else if (err instanceof Anthropic.RateLimitError) {
    console.error('Rate limited. Wait a minute and try again.');
  } else if (err instanceof Anthropic.APIError) {
    console.error(`API error ${err.status}: ${err.message}`);
  } else {
    console.error(err instanceof Error ? err.message : err);
  }
  process.exit(1);
});
