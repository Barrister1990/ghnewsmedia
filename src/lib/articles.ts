// src/lib/articles.ts
import { PLACEHOLDER_FEATURED_IMAGE } from '@/config/site';
import { supabase } from '@/integrations/supabase/client';
import { NewsArticle } from '@/types/news';

export { PLACEHOLDER_FEATURED_IMAGE };

/**
 * Columns needed to render article cards and listings. Excludes `content` (the
 * full HTML body), which is by far the largest field.
 */
export const ARTICLE_CARD_COLUMNS = [
  'id', 'title', 'slug', 'excerpt', 'featured', 'trending', 'read_time', 'views',
  'featured_image', 'created_at', 'updated_at', 'published_at',
  'category_id', 'category_name', 'category_slug', 'category_color', 'category_icon',
  'author_id', 'author_name', 'author_avatar', 'tag_names',
].join(',');

/** PostgREST caps responses at 1000 rows; page through results in chunks of this size. */
const PAGE_SIZE = 1000;

/** A row from `articles_with_details`, as accepted by `transformToNewsArticle`. */
export type ArticleRow = Parameters<typeof transformToNewsArticle>[0];

export const transformToNewsArticle = (article: any): NewsArticle => {
  if (!article.id || !article.title) {
    throw new Error('Article missing essential fields');
  }

  const social: { twitter?: string; facebook?: string; linkedin?: string } = {};
  if (article.author_twitter) social.twitter = article.author_twitter;
  if (article.author_facebook) social.facebook = article.author_facebook;
  if (article.author_linkedin) social.linkedin = article.author_linkedin;

  return {
    id: article.id,
    title: article.title,
    slug: article.slug || '',
    excerpt: article.excerpt || '',
    content: article.content || '',
    featuredImage: article.featured_image || PLACEHOLDER_FEATURED_IMAGE,
    featured_image_credit: article.featured_image_credit || null,
    author: {
      id: article.author_id || '',
      name: article.author_name || 'Unknown Author',
      bio: article.author_bio || '',
      avatar: article.author_avatar || '',
      title: article.author_title || '',
      social
    },
    category: {
      id: article.category_id || '',
      name: article.category_name || 'General',
      slug: article.category_slug || article.category_name?.toLowerCase().replace(/\s+/g, '-') || 'general',
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

interface FetchPublishedOptions {
  /** Columns to select. Defaults to card columns (no article body). */
  columns?: string;
  /** Maximum rows to return. Defaults to every published article. */
  limit?: number;
  /** Only include articles published at or after this date. */
  publishedSince?: Date;
}

export const fetchPublishedArticles = async ({
  columns = ARTICLE_CARD_COLUMNS,
  limit = Infinity,
  publishedSince,
}: FetchPublishedOptions = {}): Promise<{
  articles: NewsArticle[];
  error: string | null;
}> => {
  try {
    const rows: ArticleRow[] = [];

    while (rows.length < limit) {
      const from = rows.length;
      const to = Math.min(from + PAGE_SIZE, limit) - 1;

      let query = supabase
        .from('articles_with_details')
        .select(columns)
        .eq('status', 'published')
        .not('content', 'is', null);
      if (publishedSince) {
        // Some published rows have no published_at; they are dated by created_at elsewhere.
        const since = publishedSince.toISOString();
        query = query.or(
          `published_at.gte.${since},and(published_at.is.null,created_at.gte.${since})`
        );
      }

      const { data, error } = await query
        .order('published_at', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false })
        .order('id', { ascending: true })
        .range(from, to);

      if (error) throw error;

      rows.push(...(data || []));
      if (!data || data.length < to - from + 1) break;
    }

    return {
      articles: rows.filter((row) => row.id && row.title).map(transformToNewsArticle),
      error: null,
    };
  } catch (error) {
    console.error('Error in fetchPublishedArticles:', error);
    return {
      articles: [],
      error: error instanceof Error ? error.message : 'Failed to fetch articles'
    };
  }
};

/**
 * Related article cards: same category first, topped up with the latest from
 * other categories. Only fetches what is rendered.
 */
export const fetchRelatedArticles = async (
  article: NewsArticle,
  limit = 3
): Promise<NewsArticle[]> => {
  const baseQuery = () =>
    supabase
      .from('articles_with_details')
      .select(ARTICLE_CARD_COLUMNS)
      .eq('status', 'published')
      .neq('id', article.id)
      .order('published_at', { ascending: false, nullsFirst: false });

  try {
    const { data: sameCategory, error } = await baseQuery()
      .eq('category_id', article.category.id)
      .limit(limit);
    if (error) throw error;

    const related = (sameCategory || []) as ArticleRow[];
    if (related.length < limit) {
      const { data: others, error: othersError } = await baseQuery()
        .neq('category_id', article.category.id)
        .limit(limit - related.length);
      if (othersError) throw othersError;
      related.push(...((others || []) as ArticleRow[]));
    }

    return related.filter((row) => row.id && row.title).map(transformToNewsArticle);
  } catch (error) {
    console.error('Error in fetchRelatedArticles:', error);
    return [];
  }
};

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Most-viewed published stories of the last `days` days, widening to 30 days when
 * the recent window is too thin to fill the list. Returns [] on failure.
 */
export const fetchMostPopular = async (limit = 10, days = 7): Promise<NewsArticle[]> => {
  const query = (sinceDays: number) =>
    supabase
      .from('articles_with_details')
      .select(ARTICLE_CARD_COLUMNS)
      .eq('status', 'published')
      .not('content', 'is', null)
      .gte('published_at', new Date(Date.now() - sinceDays * DAY_MS).toISOString())
      .order('views', { ascending: false, nullsFirst: false })
      .limit(limit);

  try {
    let { data, error } = await query(days);
    if (error) throw error;
    if ((data?.length ?? 0) < Math.min(limit, 5) && days < 30) {
      ({ data, error } = await query(30));
      if (error) throw error;
    }
    return ((data || []) as ArticleRow[]).filter((row) => row.id && row.title).map(transformToNewsArticle);
  } catch (error) {
    console.error('Error in fetchMostPopular:', error);
    return [];
  }
};

/** Latest published stories in any of the given category slugs. Returns [] on failure. */
export const fetchLatestInCategories = async (categorySlugs: string[], limit = 3): Promise<NewsArticle[]> => {
  try {
    const { data, error } = await supabase
      .from('articles_with_details')
      .select(ARTICLE_CARD_COLUMNS)
      .eq('status', 'published')
      .not('content', 'is', null)
      .in('category_slug', categorySlugs)
      .order('published_at', { ascending: false, nullsFirst: false })
      .limit(limit);
    if (error) throw error;
    return ((data || []) as ArticleRow[]).filter((row) => row.id && row.title).map(transformToNewsArticle);
  } catch (error) {
    console.error('Error in fetchLatestInCategories:', error);
    return [];
  }
};

/**
 * Fetch one published article. `article` is null with no `error` when the slug
 * does not exist; `error` is set only for real failures (network, database).
 */
export const fetchArticleBySlug = async (slug: string): Promise<{
  article: NewsArticle | null;
  error: string | null;
}> => {
  try {
    const { data: articleData, error: articleError } = await supabase
      .from('articles_with_details')
      .select('*')
      .eq('status', 'published')
      .eq('slug', slug)
      .order('published_at', { ascending: false, nullsFirst: false })
      .limit(1)
      .maybeSingle();

    if (articleError) {
      console.error('Error fetching article by slug:', articleError);
      return {
        article: null,
        error: articleError.message
      };
    }

    if (!articleData || !articleData.id || !articleData.title || !articleData.content) {
      return {
        article: null,
        error: null
      };
    }

    const transformedArticle = transformToNewsArticle(articleData);

    // Enrich article author fields with profile data for E-E-A-T author cards.
    if (transformedArticle.author.id) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('name, bio, avatar, title, twitter, facebook, linkedin')
        .eq('id', transformedArticle.author.id)
        .maybeSingle();

      if (profileData) {
        const mergedSocial: { twitter?: string; facebook?: string; linkedin?: string } = {};
        const twitterValue = profileData.twitter || transformedArticle.author.social.twitter;
        const facebookValue = profileData.facebook || transformedArticle.author.social.facebook;
        const linkedinValue = profileData.linkedin || transformedArticle.author.social.linkedin;

        if (twitterValue) mergedSocial.twitter = twitterValue;
        if (facebookValue) mergedSocial.facebook = facebookValue;
        if (linkedinValue) mergedSocial.linkedin = linkedinValue;

        const p = profileData.avatar;
        const mergedAvatar =
          p === null || (typeof p === 'string' && p.trim() === '')
            ? ''
            : typeof p === 'string' && p.trim() !== ''
              ? p.trim()
              : transformedArticle.author.avatar ?? '';

        transformedArticle.author = {
          ...transformedArticle.author,
          name: profileData.name || transformedArticle.author.name,
          bio: profileData.bio || transformedArticle.author.bio,
          avatar: mergedAvatar,
          title: profileData.title || transformedArticle.author.title,
          social: mergedSocial,
        };
      }
    }

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
