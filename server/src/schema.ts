import { z } from 'zod';

// Article/Item schema for the homepage content
export const itemSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(), // Short description or snippet
  imageUrl: z.string().url(), // URL to thumbnail or main image
  category: z.string().nullable(), // Optional category
  created_at: z.coerce.date(), // Automatically converts string timestamps to Date objects
  updated_at: z.coerce.date()
});

export type Item = z.infer<typeof itemSchema>;

// Input schema for creating items
export const createItemInputSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().min(1, 'Description is required').max(500, 'Description too long'),
  imageUrl: z.string().url('Must be a valid URL'),
  category: z.string().nullable() // Explicit null allowed, undefined not allowed
});

export type CreateItemInput = z.infer<typeof createItemInputSchema>;

// Input schema for updating items
export const updateItemInputSchema = z.object({
  id: z.number(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(500).optional(),
  imageUrl: z.string().url().optional(),
  category: z.string().nullable().optional() // Can be null or undefined
});

export type UpdateItemInput = z.infer<typeof updateItemInputSchema>;

// Input schema for getting items with pagination and filtering
export const getItemsInputSchema = z.object({
  limit: z.number().int().min(1).max(100).optional().default(20),
  offset: z.number().int().min(0).optional().default(0),
  category: z.string().nullable().optional(), // Filter by category
  search: z.string().optional() // Search in title and description
});

export type GetItemsInput = z.infer<typeof getItemsInputSchema>;

// Input schema for getting a single item by ID
export const getItemInputSchema = z.object({
  id: z.number()
});

export type GetItemInput = z.infer<typeof getItemInputSchema>;

// Input schema for deleting an item
export const deleteItemInputSchema = z.object({
  id: z.number()
});

export type DeleteItemInput = z.infer<typeof deleteItemInputSchema>;

// Response schema for paginated items
export const itemsResponseSchema = z.object({
  items: z.array(itemSchema),
  total: z.number(),
  hasMore: z.boolean()
});

export type ItemsResponse = z.infer<typeof itemsResponseSchema>;