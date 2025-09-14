import { serial, text, pgTable, timestamp, integer } from 'drizzle-orm/pg-core';

export const articlesTable = pgTable('articles', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  author: text('author').notNull(),
  publish_time: timestamp('publish_time').notNull(),
  comment_count: integer('comment_count').notNull().default(0),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// TypeScript types for the table schema
export type Article = typeof articlesTable.$inferSelect; // For SELECT operations
export type NewArticle = typeof articlesTable.$inferInsert; // For INSERT operations

// Important: Export all tables and relations for proper query building
export const tables = { articles: articlesTable };