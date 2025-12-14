-- Migration: Add category_slug to articles_with_details View
-- Date: 2024
-- Description: Adds category_slug field to the articles_with_details view for category-based URLs

-- Drop the view if it exists
DROP VIEW IF EXISTS articles_with_details;

-- Recreate the view with category_slug
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
    c.slug as category_slug,
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
    c.slug,
    c.color,
    c.icon,
    a.author_id,
    p.name,
    p.avatar;

-- Add comment for documentation
COMMENT ON VIEW articles_with_details IS 'Comprehensive view combining articles with category (including slug), author, and tag information for easy querying';

-- Grant permissions (adjust as needed for your setup)
GRANT SELECT ON articles_with_details TO authenticated;
GRANT SELECT ON articles_with_details TO anon;
