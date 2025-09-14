import { z } from 'zod';

// Article schema
export const articleSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  author: z.string(),
  publish_time: z.coerce.date(),
  comment_count: z.number().int().nonnegative(),
  created_at: z.coerce.date()
});

export type Article = z.infer<typeof articleSchema>;

// Input schema for creating articles
export const createArticleInputSchema = z.object({
  title: z.string(),
  content: z.string(),
  author: z.string(),
  publish_time: z.coerce.date()
});

export type CreateArticleInput = z.infer<typeof createArticleInputSchema>;

// Input schema for updating articles
export const updateArticleInputSchema = z.object({
  id: z.number(),
  title: z.string().optional(),
  content: z.string().optional(),
  author: z.string().optional(),
  publish_time: z.coerce.date().optional()
});

export type UpdateArticleInput = z.infer<typeof updateArticleInputSchema>;