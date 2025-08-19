# Articles with Details View - Database Documentation

## 🎯 **Overview**

The `articles_with_details` view is a comprehensive database view that combines articles with their related category, author, and tag information. This view eliminates the need for multiple JOIN queries throughout the application and provides a single, efficient way to access all article-related data.

## 🏗️ **View Structure**

### **Base Tables**
- **`articles`** - Main article content and metadata
- **`categories`** - Article categories with colors and icons
- **`profiles`** - Author information and avatars
- **`tags`** - Article tags for categorization
- **`article_tags`** - Junction table linking articles to tags

### **View Fields**

#### **Article Fields**
```sql
a.id,                    -- Unique article identifier
a.title,                 -- Article title
a.slug,                  -- URL-friendly identifier
a.excerpt,               -- Article summary
a.content,               -- Full article content
a.status,                -- Publication status (draft/published/archived)
a.featured,              -- Featured article flag
a.trending,              -- Trending article flag
a.read_time,             -- Estimated reading time in minutes
a.views,                 -- Article view count
a.featured_image,        -- Main article image URL
a.meta_title,            -- SEO meta title
a.meta_description,      -- SEO meta description
a.keywords,              -- SEO keywords array
a.created_at,            -- Creation timestamp
a.updated_at,            -- Last update timestamp
a.published_at           -- Publication timestamp
```

#### **Category Fields**
```sql
a.category_id,           -- Category reference
c.name as category_name, -- Category name
c.color as category_color, -- Category color for UI
c.icon as category_icon  -- Category icon for UI
```

#### **Author Fields**
```sql
a.author_id,             -- Author reference
p.name as author_name,   -- Author display name
p.avatar as author_avatar -- Author profile picture
```

#### **Tag Fields**
```sql
tag_names                -- Array of tag names (e.g., ['Technology', 'AI', 'News'])
```

## 🔧 **Technical Implementation**

### **View Creation SQL**
```sql
CREATE VIEW articles_with_details AS
SELECT 
    -- Article fields
    a.id, a.title, a.slug, a.excerpt, a.content,
    a.status, a.featured, a.trending, a.read_time,
    a.views, a.featured_image, a.meta_title,
    a.meta_description, a.keywords, a.created_at,
    a.updated_at, a.published_at,
    
    -- Category fields
    a.category_id, c.name as category_name,
    c.color as category_color, c.icon as category_icon,
    
    -- Author fields
    a.author_id, p.name as author_name, p.avatar as author_avatar,
    
    -- Tags (aggregated as array)
    COALESCE(
        ARRAY_AGG(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL),
        ARRAY[]::text[]
    ) as tag_names

FROM articles a
LEFT JOIN categories c ON a.category_id = c.id
LEFT JOIN profiles p ON a.author_id = p.id
LEFT JOIN article_tags at ON a.id = at.article_id
LEFT JOIN tags t ON at.tag_id = t.id

GROUP BY [all non-aggregated fields];
```

### **Key Features**
- **LEFT JOINs**: Ensures articles appear even if category/author/tags are missing
- **Array Aggregation**: Combines multiple tags into a single array field
- **Performance Indexes**: Optimized for common query patterns
- **Permission Control**: Proper access control for authenticated users

## 🚀 **Usage Examples**

### **1. Get All Published Articles**
```typescript
const { data: articles, error } = await supabase
  .from('articles_with_details')
  .select('*')
  .eq('status', 'published')
  .order('published_at', { ascending: false });
```

### **2. Get Featured Articles**
```typescript
const { data: featuredArticles, error } = await supabase
  .from('articles_with_details')
  .select('*')
  .eq('featured', true)
  .eq('status', 'published')
  .order('published_at', { ascending: false });
```

### **3. Get Articles by Category**
```typescript
const { data: categoryArticles, error } = await supabase
  .from('articles_with_details')
  .select('*')
  .eq('category_name', 'Technology')
  .eq('status', 'published')
  .order('published_at', { ascending: false });
```

### **4. Get Articles by Author**
```typescript
const { data: authorArticles, error } = await supabase
  .from('articles_with_details')
  .select('*')
  .eq('author_name', 'John Doe')
  .eq('status', 'published')
  .order('published_at', { ascending: false });
```

### **5. Get Trending Articles**
```typescript
const { data: trendingArticles, error } = await supabase
  .select('*')
  .from('articles_with_details')
  .eq('trending', true)
  .eq('status', 'published')
  .order('views', { ascending: false });
```

### **6. Search Articles**
```typescript
const { data: searchResults, error } = await supabase
  .from('articles_with_details')
  .select('*')
  .eq('status', 'published')
  .or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
  .order('published_at', { ascending: false });
```

### **7. Get Articles with Specific Tags**
```typescript
const { data: taggedArticles, error } = await supabase
  .from('articles_with_details')
  .select('*')
  .eq('status', 'published')
  .contains('tag_names', ['Technology', 'AI'])
  .order('published_at', { ascending: false });
```

### **8. Get Recent Articles**
```typescript
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

const { data: recentArticles, error } = await supabase
  .from('articles_with_details')
  .select('*')
  .eq('status', 'published')
  .gte('published_at', thirtyDaysAgo.toISOString())
  .order('published_at', { ascending: false });
```

## 📊 **Performance Optimization**

### **Indexes Created**
```sql
-- Status-based queries
CREATE INDEX idx_articles_with_details_status ON articles_with_details(status);

-- Date-based queries
CREATE INDEX idx_articles_with_details_published_at ON articles_with_details(published_at);
CREATE INDEX idx_articles_with_details_created_at ON articles_with_details(created_at);

-- Category and author queries
CREATE INDEX idx_articles_with_details_category_id ON articles_with_details(category_id);
CREATE INDEX idx_articles_with_details_author_id ON articles_with_details(author_id);

-- Boolean flag queries
CREATE INDEX idx_articles_with_details_featured ON articles_with_details(featured);
CREATE INDEX idx_articles_with_details_trending ON articles_with_details(trending);
```

### **Query Optimization Tips**
- **Use indexed fields** for WHERE clauses (status, published_at, category_id, etc.)
- **Limit results** with `.limit()` for pagination
- **Select specific fields** instead of `*` when possible
- **Use range queries** for date-based filtering

## 🔍 **Common Query Patterns**

### **Homepage Articles**
```typescript
// Get featured and trending articles for homepage
const { data: homepageArticles, error } = await supabase
  .from('articles_with_details')
  .select('*')
  .eq('status', 'published')
  .or('featured.eq.true,trending.eq.true')
  .order('published_at', { ascending: false })
  .limit(10);
```

### **Category Pages**
```typescript
// Get articles for a specific category with pagination
const { data: categoryArticles, error } = await supabase
  .from('articles_with_details')
  .select('*')
  .eq('status', 'published')
  .eq('category_name', categorySlug)
  .order('published_at', { ascending: false })
  .range(pageStart, pageEnd);
```

### **Author Pages**
```typescript
// Get all articles by a specific author
const { data: authorArticles, error } = await supabase
  .from('articles_with_details')
  .select('*')
  .eq('status', 'published')
  .eq('author_id', authorId)
  .order('published_at', { ascending: false });
```

### **Search Results**
```typescript
// Search articles with full-text search
const { data: searchResults, error } = await supabase
  .from('articles_with_details')
  .select('*')
  .eq('status', 'published')
  .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%`)
  .order('published_at', { ascending: false });
```

## 🚨 **Important Notes**

### **Data Consistency**
- **Tags Array**: Empty tags result in `[]` (empty array), not `null`
- **Missing Relations**: Articles without categories/authors will have `null` values
- **Status Filtering**: Always filter by `status = 'published'` for public content

### **Performance Considerations**
- **Large Content**: The `content` field can be large; consider excluding it for list views
- **Tag Aggregation**: Tag aggregation adds some overhead; use sparingly for high-traffic queries
- **Index Usage**: Ensure your queries use the created indexes for optimal performance

### **Security**
- **Row Level Security**: Ensure RLS policies are properly configured
- **Permission Grants**: View permissions are granted to authenticated and anonymous users
- **Data Access**: Users can only see articles they have permission to view

## 🔧 **Maintenance**

### **View Updates**
```sql
-- Refresh the view (if underlying tables change)
REFRESH MATERIALIZED VIEW articles_with_details;

-- Or recreate the view
DROP VIEW articles_with_details;
-- Run the CREATE VIEW statement again
```

### **Performance Monitoring**
```sql
-- Check view usage statistics
SELECT schemaname, viewname, n_tup_ins, n_tup_upd, n_tup_del
FROM pg_stat_user_tables 
WHERE viewname = 'articles_with_details';

-- Check index usage
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes 
WHERE tablename = 'articles_with_details';
```

## 📚 **Related Files**

- **`database_migrations/create_articles_with_details_view.sql`** - View creation script
- **`src/integrations/supabase/types.ts`** - TypeScript type definitions
- **`src/hooks/usePublishedArticles.ts`** - Hook using this view
- **`src/hooks/useAllArticles.ts`** - Hook using this view
- **`src/pages/index.tsx`** - Homepage using this view

---

## 🏆 **Status: ARTICLES_WITH_DETAILS VIEW DOCUMENTATION COMPLETE**

The `articles_with_details` view provides a comprehensive, efficient way to access all article-related data in a single query. This view is used throughout the application and eliminates the need for complex JOIN operations.

**Ready for production use!** 🚀

The view combines articles with categories, authors, and tags, providing a unified interface for all article-related queries while maintaining optimal performance through proper indexing.
