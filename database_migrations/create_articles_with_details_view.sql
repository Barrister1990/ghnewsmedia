-- Migration: Create articles_with_details View
-- Date: 2024
-- Description: Creates a comprehensive view that combines articles with their related data
-- This view is used throughout the application for displaying articles with full context

-- Drop the view if it exists (for migrations)
DROP VIEW IF EXISTS articles_with_details;

-- Create the articles_with_details view
CREATE VIEW articles_with_details AS
SELECT 
    -- Article fields
    a.id,
    a.title,
    a.slug,
    a.excerpt,
    a.content,
    a.status,
    a.featured,
    a.trending,
    a.read_time,
    a.views,
    a.featured_image,
    a.meta_title,
    a.meta_description,
    a.keywords,
    a.created_at,
    a.updated_at,
    a.published_at,
    
    -- Category fields
    a.category_id,
    c.name as category_name,
    c.color as category_color,
    c.icon as category_icon,
    
    -- Author fields
    a.author_id,
    p.name as author_name,
    p.avatar as author_avatar,
    
    -- Tags (aggregated as array)
    COALESCE(
        ARRAY_AGG(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL),
        ARRAY[]::text[]
    ) as tag_names

FROM articles a
-- Join with categories
LEFT JOIN categories c ON a.category_id = c.id
-- Join with profiles (authors)
LEFT JOIN profiles p ON a.author_id = p.id
-- Join with article_tags and tags
LEFT JOIN article_tags at ON a.id = at.article_id
LEFT JOIN tags t ON at.tag_id = t.id

-- Group by all non-aggregated fields to handle the tag aggregation
GROUP BY 
    a.id,
    a.title,
    a.slug,
    a.excerpt,
    a.content,
    a.status,
    a.featured,
    a.trending,
    a.read_time,
    a.views,
    a.featured_image,
    a.meta_title,
    a.meta_description,
    a.keywords,
    a.created_at,
    a.updated_at,
    a.published_at,
    a.category_id,
    c.name,
    c.color,
    c.icon,
    a.author_id,
    p.name,
    p.avatar;

-- Add comment for documentation
COMMENT ON VIEW articles_with_details IS 'Comprehensive view combining articles with category, author, and tag information for easy querying';

-- Grant permissions (adjust as needed for your setup)
GRANT SELECT ON articles_with_details TO authenticated;
GRANT SELECT ON articles_with_details TO anon;

-- Create indexes for better performance on commonly queried fields
CREATE INDEX IF NOT EXISTS idx_articles_with_details_status ON articles_with_details(status);
CREATE INDEX IF NOT EXISTS idx_articles_with_details_published_at ON articles_with_details(published_at);
CREATE INDEX IF NOT EXISTS idx_articles_with_details_category_id ON articles_with_details(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_with_details_author_id ON articles_with_details(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_with_details_featured ON articles_with_details(featured);
CREATE INDEX IF NOT EXISTS idx_articles_with_details_trending ON articles_with_details(trending);
CREATE INDEX IF NOT EXISTS idx_articles_with_details_created_at ON articles_with_details(created_at);

-- Example queries for testing the view:

-- 1. Get all published articles with details
-- SELECT * FROM articles_with_details WHERE status = 'published' ORDER BY published_at DESC;

-- 2. Get featured articles with details
-- SELECT * FROM articles_with_details WHERE featured = true AND status = 'published' ORDER BY published_at DESC;

-- 3. Get articles by category with details
-- SELECT * FROM articles_with_details WHERE category_name = 'Technology' AND status = 'published' ORDER BY published_at DESC;

-- 4. Get articles by author with details
-- SELECT * FROM articles_with_details WHERE author_name = 'John Doe' AND status = 'published' ORDER BY published_at DESC;

-- 5. Get trending articles with details
-- SELECT * FROM articles_with_details WHERE trending = true AND status = 'published' ORDER BY views DESC;

-- 6. Search articles by title or content with details
-- SELECT * FROM articles_with_details 
-- WHERE status = 'published' 
-- AND (title ILIKE '%search_term%' OR content ILIKE '%search_term%')
-- ORDER BY published_at DESC;

-- 7. Get articles with specific tags
-- SELECT * FROM articles_with_details 
-- WHERE status = 'published' 
-- AND 'Technology' = ANY(tag_names)
-- ORDER BY published_at DESC;

-- 8. Get recent articles with details (last 30 days)
-- SELECT * FROM articles_with_details 
-- WHERE status = 'published' 
-- AND published_at >= NOW() - INTERVAL '30 days'
-- ORDER BY published_at DESC;
