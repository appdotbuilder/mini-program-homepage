import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { articlesTable } from '../db/schema';
import { type CreateArticleInput } from '../schema';
import { createArticle } from '../handlers/create_article';
import { eq, gte, between, and } from 'drizzle-orm';

// Simple test input
const testInput: CreateArticleInput = {
  title: 'Test Article',
  content: 'This is a test article content for testing purposes.',
  author: 'Test Author',
  publish_time: new Date('2024-01-15T10:00:00Z')
};

describe('createArticle', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create an article', async () => {
    const result = await createArticle(testInput);

    // Basic field validation
    expect(result.title).toEqual('Test Article');
    expect(result.content).toEqual(testInput.content);
    expect(result.author).toEqual('Test Author');
    expect(result.publish_time).toEqual(testInput.publish_time);
    expect(result.comment_count).toEqual(0);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should save article to database', async () => {
    const result = await createArticle(testInput);

    // Query using proper drizzle syntax
    const articles = await db.select()
      .from(articlesTable)
      .where(eq(articlesTable.id, result.id))
      .execute();

    expect(articles).toHaveLength(1);
    expect(articles[0].title).toEqual('Test Article');
    expect(articles[0].content).toEqual(testInput.content);
    expect(articles[0].author).toEqual('Test Author');
    expect(articles[0].publish_time).toEqual(testInput.publish_time);
    expect(articles[0].comment_count).toEqual(0);
    expect(articles[0].created_at).toBeInstanceOf(Date);
  });

  it('should handle different publish times correctly', async () => {
    const pastDate = new Date('2023-12-01T15:30:00Z');
    const futureDate = new Date('2025-06-15T08:45:00Z');

    const pastInput: CreateArticleInput = {
      ...testInput,
      title: 'Past Article',
      publish_time: pastDate
    };

    const futureInput: CreateArticleInput = {
      ...testInput,
      title: 'Future Article',
      publish_time: futureDate
    };

    const pastResult = await createArticle(pastInput);
    const futureResult = await createArticle(futureInput);

    expect(pastResult.publish_time).toEqual(pastDate);
    expect(futureResult.publish_time).toEqual(futureDate);
  });

  it('should query articles by date range correctly', async () => {
    // Create test articles with different publish times
    const article1Input: CreateArticleInput = {
      ...testInput,
      title: 'Article 1',
      publish_time: new Date('2024-01-10T10:00:00Z')
    };

    const article2Input: CreateArticleInput = {
      ...testInput,
      title: 'Article 2',
      publish_time: new Date('2024-01-20T10:00:00Z')
    };

    await createArticle(article1Input);
    await createArticle(article2Input);

    // Test date filtering - demonstration of correct date handling
    const startDate = new Date('2024-01-15T00:00:00Z');
    const endDate = new Date('2024-01-25T00:00:00Z');

    // Proper query building with date filter
    const articles = await db.select()
      .from(articlesTable)
      .where(
        and(
          gte(articlesTable.publish_time, startDate),
          between(articlesTable.publish_time, startDate, endDate)
        )
      )
      .execute();



    expect(articles.length).toEqual(1);
    expect(articles[0].title).toEqual('Article 2');
    expect(articles[0].publish_time).toBeInstanceOf(Date);
    expect(articles[0].publish_time >= startDate).toBe(true);
    expect(articles[0].publish_time <= endDate).toBe(true);
  });

  it('should set comment_count to 0 for new articles', async () => {
    const result = await createArticle(testInput);

    expect(result.comment_count).toEqual(0);

    // Verify in database
    const articles = await db.select()
      .from(articlesTable)
      .where(eq(articlesTable.id, result.id))
      .execute();

    expect(articles[0].comment_count).toEqual(0);
  });

  it('should create articles with different authors', async () => {
    const input1: CreateArticleInput = {
      ...testInput,
      title: 'Article by Author 1',
      author: 'Author One'
    };

    const input2: CreateArticleInput = {
      ...testInput,
      title: 'Article by Author 2',
      author: 'Author Two'
    };

    const result1 = await createArticle(input1);
    const result2 = await createArticle(input2);

    expect(result1.author).toEqual('Author One');
    expect(result2.author).toEqual('Author Two');
    expect(result1.id).not.toEqual(result2.id);
  });
});