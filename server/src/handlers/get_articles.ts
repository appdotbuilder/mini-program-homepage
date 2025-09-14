import { db } from '../db';
import { articlesTable } from '../db/schema';
import { type Article } from '../schema';
import { desc } from 'drizzle-orm';

export const getArticles = async (): Promise<Article[]> => {
  try {
    // Fetch all articles ordered by publish_time descending (newest first)
    const result = await db.select()
      .from(articlesTable)
      .orderBy(desc(articlesTable.publish_time))
      .execute();

    // Return the articles (no numeric conversion needed as all fields are integers, text, or timestamps)
    return result;
  } catch (error) {
    console.error('Articles retrieval failed:', error);
    throw error;
  }
};