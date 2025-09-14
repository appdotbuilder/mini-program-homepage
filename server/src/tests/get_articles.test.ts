import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { articlesTable } from '../db/schema';
import { type CreateArticleInput } from '../schema';
import { getArticles } from '../handlers/get_articles';

// Test article data
const testArticle1: CreateArticleInput = {
  title: 'First Article',
  content: 'Content of the first article',
  author: 'John Doe',
  publish_time: new Date('2024-01-15T10:30:00Z')
};

const testArticle2: CreateArticleInput = {
  title: 'Second Article',
  content: 'Content of the second article',
  author: 'Jane Smith',
  publish_time: new Date('2024-01-16T14:20:00Z')
};

const testArticle3: CreateArticleInput = {
  title: 'Third Article',
  content: 'Content of the third article',
  author: 'Bob Johnson',
  publish_time: new Date('2024-01-14T09:15:00Z')
};

describe('getArticles', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no articles exist', async () => {
    const result = await getArticles();

    expect(result).toHaveLength(0);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should return all articles with correct structure', async () => {
    // Create test articles
    await db.insert(articlesTable)
      .values([testArticle1, testArticle2])
      .execute();

    const result = await getArticles();

    expect(result).toHaveLength(2);
    
    // Check structure of first article
    const article = result[0];
    expect(article.id).toBeDefined();
    expect(typeof article.id).toBe('number');
    expect(typeof article.title).toBe('string');
    expect(typeof article.content).toBe('string');
    expect(typeof article.author).toBe('string');
    expect(article.publish_time).toBeInstanceOf(Date);
    expect(typeof article.comment_count).toBe('number');
    expect(article.created_at).toBeInstanceOf(Date);
  });

  it('should return articles ordered by publish_time descending', async () => {
    // Insert articles in different order than expected result
    await db.insert(articlesTable)
      .values([testArticle1, testArticle3, testArticle2])
      .execute();

    const result = await getArticles();

    expect(result).toHaveLength(3);
    
    // Should be ordered by publish_time descending (newest first)
    expect(result[0].title).toBe('Second Article'); // 2024-01-16
    expect(result[1].title).toBe('First Article');  // 2024-01-15
    expect(result[2].title).toBe('Third Article');  // 2024-01-14

    // Verify the ordering is correct
    expect(result[0].publish_time >= result[1].publish_time).toBe(true);
    expect(result[1].publish_time >= result[2].publish_time).toBe(true);
  });

  it('should include default comment_count of 0 for new articles', async () => {
    await db.insert(articlesTable)
      .values([testArticle1])
      .execute();

    const result = await getArticles();

    expect(result).toHaveLength(1);
    expect(result[0].comment_count).toBe(0);
  });

  it('should include created_at timestamp for articles', async () => {
    const beforeInsert = new Date();
    
    await db.insert(articlesTable)
      .values([testArticle1])
      .execute();

    const afterInsert = new Date();
    const result = await getArticles();

    expect(result).toHaveLength(1);
    expect(result[0].created_at).toBeInstanceOf(Date);
    expect(result[0].created_at >= beforeInsert).toBe(true);
    expect(result[0].created_at <= afterInsert).toBe(true);
  });

  it('should handle articles with different authors', async () => {
    await db.insert(articlesTable)
      .values([testArticle1, testArticle2, testArticle3])
      .execute();

    const result = await getArticles();

    expect(result).toHaveLength(3);
    
    const authors = result.map(article => article.author);
    expect(authors).toContain('John Doe');
    expect(authors).toContain('Jane Smith');
    expect(authors).toContain('Bob Johnson');
  });

  it('should return complete article data for card display', async () => {
    await db.insert(articlesTable)
      .values([testArticle1])
      .execute();

    const result = await getArticles();

    expect(result).toHaveLength(1);
    
    const article = result[0];
    // Verify all fields needed for card layout are present
    expect(article.title).toBe('First Article');
    expect(article.author).toBe('John Doe');
    expect(article.publish_time).toEqual(new Date('2024-01-15T10:30:00Z'));
    expect(article.comment_count).toBe(0);
    expect(article.content).toBe('Content of the first article');
  });
});