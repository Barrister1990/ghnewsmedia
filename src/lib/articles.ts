// src/lib/articles.ts
import { supabase } from '@/integrations/supabase/client';
import { NewsArticle } from '@/types/news';

export const transformToNewsArticle = (article: any): NewsArticle => {
  // Skip articles with null essential fields
  if (!article.id || !article.title || !article.content) {
    throw new Error('Article missing essential fields');
  }

  return {
    id: article.id,
    title: article.title,
    slug: article.slug || '',
    excerpt: article.excerpt || '',
    content: article.content,
    featuredImage: article.featured_image || 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=400&fit=crop',
    author: {
      id: article.author_id || '',
      name: article.author_name || 'Unknown Author',
      bio: '',
      avatar: article.author_avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      title: '',
      social: {}
    },
    category: {
      id: article.category_id || '',
      name: article.category_name || 'General',
      slug: article.category_name?.toLowerCase().replace(/\s+/g, '-') || 'general',
      description: '',
      color: article.category_color || '#3B82F6',
      icon: article.category_icon || '📰',
      updated_at: article.updated_at
    },
    tags: article.tag_names || [],
    publishedAt: article.published_at || article.created_at || new Date().toISOString(),
    updatedAt: article.updated_at || new Date().toISOString(),
    readTime: article.read_time || 5,
    views: article.views || 0,
    reactions: {
      likes: 0,
      hearts: 0,
      laughs: 0,
      angry: 0
    },
    comments: [],
    featured: article.featured || false,
    trending: article.trending || false
  };
};

export const fetchPublishedArticles = async (): Promise<{
  articles: NewsArticle[];
  error: string | null;
}> => {
  try {
    const { data: articlesData, error: articlesError } = await supabase
      .from('articles_with_details')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false });

    if (articlesError) {
      console.error('Error fetching articles:', articlesError);
      throw articlesError;
    }

    // Filter and transform articles, handling potential null values
    const transformedArticles = (articlesData || [])
      .filter(article => article.id && article.title && article.content) // Filter out incomplete articles
      .map(transformToNewsArticle);

    console.log('Fetched published articles:', transformedArticles);

    return {
      articles: transformedArticles,
      error: null
    };
  } catch (error) {
    console.error('Error in fetchPublishedArticles:', error);
    return {
      articles: [],
      error: error instanceof Error ? error.message : 'Failed to fetch articles'
    };
  }
};

export const fetchArticleBySlug = async (slug: string): Promise<{
  article: NewsArticle | null;
  error: string | null;
}> => {
  try {
    console.log('Fetching article by slug:', slug);
    
    const { data: articleData, error: articleError } = await supabase
      .from('articles_with_details')
      .select('*')
      .eq('status', 'published')
      .eq('slug', slug)
      .single(); // Use single() to get one result

    if (articleError) {
      console.error('Error fetching article by slug:', articleError);
      return {
        article: null,
        error: articleError.message
      };
    }

    if (!articleData || !articleData.id || !articleData.title || !articleData.content) {
      console.log('Article not found or incomplete:', articleData);
      return {
        article: null,
        error: 'Article not found or incomplete'
      };
    }

    const transformedArticle = transformToNewsArticle(articleData);
    console.log('Successfully transformed article:', transformedArticle.title);

    return {
      article: transformedArticle,
      error: null
    };
  } catch (error) {
    console.error('Error in fetchArticleBySlug:', error);
    return {
      article: null,
      error: error instanceof Error ? error.message : 'Failed to fetch article'
    };
  }
};