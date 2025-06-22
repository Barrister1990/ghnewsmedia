// lib/categories.ts - Server-side category functions
import { supabase } from '@/integrations/supabase/client';
import { Category, NewsArticle } from '@/types/news';
import { transformToNewsArticle } from './articles';

export const transformToCategory = (cat: any): Category => {
  return {
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description || '',
    color: cat.color,
    icon: cat.icon || '📰'
  };
};

export const fetchAllCategories = async (): Promise<{
  categories: Category[];
  error: string | null;
}> => {
  try {
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (categoriesError) {
      console.error('Error fetching categories:', categoriesError);
      throw categoriesError;
    }

    const transformedCategories: Category[] = (categoriesData || []).map(transformToCategory);

    return {
      categories: transformedCategories,
      error: null
    };
  } catch (error) {
    console.error('Error in fetchAllCategories:', error);
    return {
      categories: [],
      error: error instanceof Error ? error.message : 'Failed to fetch categories'
    };
  }
};

export const fetchCategoryBySlug = async (slug: string): Promise<{
  category: Category | null;
  error: string | null;
}> => {
  try {
    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single();

    if (categoryError) {
      console.error('Error fetching category by slug:', categoryError);
      return {
        category: null,
        error: categoryError.message
      };
    }

    if (!categoryData) {
      return {
        category: null,
        error: 'Category not found'
      };
    }

    const transformedCategory = transformToCategory(categoryData);

    return {
      category: transformedCategory,
      error: null
    };
  } catch (error) {
    console.error('Error in fetchCategoryBySlug:', error);
    return {
      category: null,
      error: error instanceof Error ? error.message : 'Failed to fetch category'
    };
  }
};

export const fetchArticlesByCategory = async (categoryId: string, page: number = 1, limit: number = 12): Promise<{
  articles: NewsArticle[];
  totalCount: number;
  error: string | null;
}> => {
  try {
    const offset = (page - 1) * limit;

    // Get total count for pagination
    const { count } = await supabase
      .from('articles_with_details')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published')
      .eq('category_id', categoryId);

    // Get articles for current page
    const { data: articlesData, error: articlesError } = await supabase
      .from('articles_with_details')
      .select('*')
      .eq('status', 'published')
      .eq('category_id', categoryId)
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (articlesError) {
      console.error('Error fetching articles by category:', articlesError);
      throw articlesError;
    }

    const transformedArticles = (articlesData || [])
      .filter(article => article.id && article.title && article.content)
      .map(transformToNewsArticle);

    return {
      articles: transformedArticles,
      totalCount: count || 0,
      error: null
    };
  } catch (error) {
    console.error('Error in fetchArticlesByCategory:', error);
    return {
      articles: [],
      totalCount: 0,
      error: error instanceof Error ? error.message : 'Failed to fetch articles'
    };
  }
};