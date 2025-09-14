import { serial, text, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

export const itemsTable = pgTable('items', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description').notNull(), // Short description or snippet
  imageUrl: text('image_url').notNull(), // URL to thumbnail or main image
  category: varchar('category', { length: 100 }), // Nullable by default, matches Zod schema
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// TypeScript type for the table schema
export type Item = typeof itemsTable.$inferSelect; // For SELECT operations
export type NewItem = typeof itemsTable.$inferInsert; // For INSERT operations

// Important: Export all tables and relations for proper query building
export const tables = { items: itemsTable };