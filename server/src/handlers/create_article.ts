import { db } from '../db';
import { articlesTable } from '../db/schema';
import { type CreateArticleInput, type Article } from '../schema';

export const createArticle = async (input: CreateArticleInput): Promise<Article> => {
  try {
    // Insert article record
    const result = await db.insert(articlesTable)
      .values({
        title: input.title,
        content: input.content,
        author: input.author,
        publish_time: input.publish_time,
        comment_count: 0 // New articles start with 0 comments
      })
      .returning()
      .execute();

    // Return the created article
    const article = result[0];
    return {
      ...article,
      publish_time: article.publish_time,
      created_at: article.created_at
    };
  } catch (error) {
    console.error('Article creation failed:', error);
    throw error;
  }
};