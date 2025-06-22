
import Link from 'next/link';
import { NewsArticle } from '../types/news';
import ArticleSEO from './SEO/ArticleSEO';

const ArticleNotFound = () => {
  const notFoundArticle = {
    id: "404",
    title: "Article Not Found",
    slug: "404",
    excerpt: "The article you're looking for could not be found. Browse our latest news and updates from Ghana.",
    content: "This article could not be found.",
    featuredImage: "https://ghnewsmedia.com/placeholder.svg",
    author: { 
      id: "404", 
      name: "GhNewsMedia", 
      bio: "Ghana's leading news source",
      avatar: "https://ghnewsmedia.com/placeholder.svg",
      title: "Editorial Team",
      social: {}
    },
    category: { 
      id: "404", 
      name: "Error", 
      slug: "error",
      description: "Error pages",
      color: "#ef4444",
      icon: "AlertTriangle",
      updated_at:""
    },
    tags: [],
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    readTime: 1,
    views: 0,
    reactions: {
      likes: 0,
      hearts: 0,
      laughs: 0,
      angry: 0
    },
    comments: [],
    featured: false,
    trending: false
  } as NewsArticle;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <ArticleSEO article={notFoundArticle} />
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Article Not Found</h1>
        <p className="text-gray-600 mb-8">Sorry, the article you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/" className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors">
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default ArticleNotFound;
