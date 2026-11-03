// Reads project source code at a pinned commit. Shared by the site build and scripts/explain.ts,
// so it only uses Node APIs (no Vite or Astro imports).
import { execFileSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

export const SELF_REPO = 'self';
export const WORKING_TREE = 'working-tree';

const CACHE_DIR = join(process.cwd(), '.cache', 'source');

export async function readSourceFile(repo: string, commit: string, path: string): Promise<string> {
  if (repo === SELF_REPO) return readSelf(commit, path);

  const cached = join(CACHE_DIR, repo, commit, path);
  try {
    return await readFile(cached, 'utf8');
  } catch {
    // not cached yet
  }

  const url = `https://raw.githubusercontent.com/${repo}/${commit}/${path}`;
  const headers: Record<string, string> = {};
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`Could not fetch ${repo}@${commit.slice(0, 7)}:${path} (HTTP ${res.status})`);
  }
  const text = await res.text();
  await mkdir(dirname(cached), { recursive: true });
  await writeFile(cached, text);
  return text;
}

async function readSelf(commit: string, path: string): Promise<string> {
  if (commit === WORKING_TREE) return readFile(join(process.cwd(), path), 'utf8');
  return execFileSync('git', ['show', `${commit}:${path}`], { encoding: 'utf8' });
}

export function sourceUrl(repo: string, commit: string, path?: string): string | undefined {
  if (repo === SELF_REPO) return undefined;
  const base = `https://github.com/${repo}`;
  return path ? `${base}/blob/${commit}/${path}` : `${base}/tree/${commit}`;
}

export function lineCount(text: string): number {
  return text.replace(/\n$/, '').split('\n').length;
}
