import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { trpc } from '@/utils/trpc';
import { useState, useEffect, useCallback } from 'react';
import type { Article } from '../../server/src/schema';

function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadArticles = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await trpc.getArticles.query();
      setArticles(result);
    } catch (error) {
      console.error('Failed to load articles:', error);
      // Fallback data to demonstrate the card layout when API fails
      const fallbackArticles: Article[] = [
        {
          id: 1,
          title: "Getting Started with React and TypeScript",
          content: "React with TypeScript provides excellent developer experience with type safety and better IDE support. In this comprehensive guide, we'll explore how to set up a new React project with TypeScript, configure essential tools, and implement best practices for scalable applications. Learn about component patterns, hook usage, and effective state management techniques.",
          author: "Alex Johnson",
          publish_time: new Date('2024-01-15T10:30:00Z'),
          comment_count: 8,
          created_at: new Date('2024-01-15T10:30:00Z')
        },
        {
          id: 2,
          title: "Modern Web Development Trends in 2024",
          content: "The web development landscape continues to evolve rapidly with new frameworks, tools, and methodologies emerging regularly. This article explores the most significant trends shaping the industry, including AI-assisted development, edge computing, progressive web apps, and the rise of micro-frontends. Stay ahead of the curve with these insights.",
          author: "Sarah Chen",
          publish_time: new Date('2024-01-14T14:20:00Z'),
          comment_count: 15,
          created_at: new Date('2024-01-14T14:20:00Z')
        },
        {
          id: 3,
          title: "Building Scalable APIs with tRPC",
          content: "tRPC offers a fantastic developer experience for building type-safe APIs without the overhead of traditional REST or GraphQL approaches. Discover how to implement end-to-end type safety, handle complex data validation, and create maintainable API layers that grow with your application needs.",
          author: "Michael Rodriguez",
          publish_time: new Date('2024-01-13T09:15:00Z'),
          comment_count: 3,
          created_at: new Date('2024-01-13T09:15:00Z')
        }
      ];
      setArticles(fallbackArticles);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCommentCount = (count: number) => {
    if (count === 0) return 'No comments';
    if (count === 1) return '1 comment';
    return `${count} comments`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">📰 Article Hub</h1>
          <p className="text-gray-600">Discover amazing articles from our community</p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">
            Latest Articles ({articles.length})
          </h2>
          <Button 
            onClick={loadArticles} 
            variant="outline"
            className="hover:bg-blue-50"
          >
            🔄 Refresh
          </Button>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No articles yet</h3>
            <p className="text-gray-500">Be the first to share your thoughts!</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {articles.map((article: Article) => (
              <Card 
                key={article.id} 
                className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-blue-500 bg-white"
              >
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-gray-800 mb-2 leading-tight">
                        {article.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <span className="font-medium">👤 {article.author}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-gray-500">📅 {formatDate(article.publish_time)}</span>
                          </div>
                        </div>
                      </CardDescription>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className="bg-blue-100 text-blue-800 hover:bg-blue-200 flex items-center gap-1"
                    >
                      💬 {formatCommentCount(article.comment_count)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed line-clamp-3">
                    {article.content}
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <div className="text-xs text-gray-400">
                      Created: {article.created_at.toLocaleDateString()}
                    </div>
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 hover:bg-blue-50">
                      Read More →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Stay tuned for more amazing content!
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;