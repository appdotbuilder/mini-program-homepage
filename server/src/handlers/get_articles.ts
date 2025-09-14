import { type Article } from '../schema';

export async function getArticles(): Promise<Article[]> {
    // This is a placeholder declaration! Real code should be implemented here.
    // The goal of this handler is fetching all articles from the database with
    // author, publish_time, and comment_count for card layout display.
    return [
        {
            id: 1,
            title: "Sample Article 1",
            content: "This is a sample article content...",
            author: "John Doe",
            publish_time: new Date('2024-01-15T10:30:00Z'),
            comment_count: 5,
            created_at: new Date('2024-01-15T10:30:00Z')
        },
        {
            id: 2,
            title: "Sample Article 2", 
            content: "Another sample article content...",
            author: "Jane Smith",
            publish_time: new Date('2024-01-14T14:20:00Z'),
            comment_count: 12,
            created_at: new Date('2024-01-14T14:20:00Z')
        }
    ] as Article[];
}