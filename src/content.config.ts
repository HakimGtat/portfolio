import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Hand-written project pages. Everything factual (role, results) lives here, never in AI drafts.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string().max(140),
    order: z.number().default(100),
    status: z.enum(['live', 'draft']).default('live'),
    // "owner/name" on GitHub, or "self" for this site's own repo.
    repo: z.string(),
    // Pinned commit SHA. "working-tree" is allowed for repo: self until the first push.
    commit: z.string(),
    role: z.string(),
    stack: z.array(z.string()).min(1),
    results: z.array(z.string()).default([]),
    files: z
      .array(z.object({ path: z.string(), label: z.string().optional() }))
      .min(1)
      .max(5),
    demo: z
      .object({
        type: z.enum(['video', 'youtube', 'image']),
        src: z.string(),
        poster: z.string().optional(),
        caption: z.string().optional(),
      })
      .optional(),
  }),
});

// AI-drafted, human-reviewed explanations. One JSON file per project, same slug.
const explanations = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/explanations' }),
  schema: z.object({
    reviewed: z.boolean(),
    model: z.string().optional(),
    commit: z.string(),
    overview: z.string(),
    steps: z
      .array(
        z.object({
          title: z.string(),
          file: z.string(),
          lines: z.tuple([z.number().int().min(1), z.number().int().min(1)]),
          note: z.string(),
        }),
      )
      .max(6),
  }),
});

export const collections = { projects, explanations };
