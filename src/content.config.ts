import { defineCollection } from 'astro:content';
import { z } from 'astro:schema';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        summary: z.string().max(200), // card excerpt + meta-description fallback
        category: z.enum(['professional', 'freelance', 'personal']),
        role: z.string(),
        dateStart: z.coerce.date(),
        dateEnd: z.coerce.date().optional(), // absent = ongoing
        displayDate: z.string().optional(), // "2023–2024" override; else derived
        technologies: z.array(z.string()).min(1),
        featured: z.boolean().default(false),
        repositoryUrl: z.string().url().optional(),
        liveUrl: z.string().url().optional(),
        coverImage: image().optional(),
        coverAlt: z.string().min(1).optional(),
        draft: z.boolean().default(false),
        seoDescription: z.string().max(160).optional(),
      })
      .refine((p) => !p.coverImage || !!p.coverAlt, {
        message: 'coverAlt is required when coverImage is set',
        path: ['coverAlt'],
      }),
});

export const collections = { projects };
