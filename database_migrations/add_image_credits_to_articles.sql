-- Migration: Add Image Credits to Articles Table
-- Date: 2024
-- Description: Adds image credit fields to store copyright information for all images

-- Add featured image credit field
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS featured_image_credit VARCHAR(255);

-- Add inline image credits field (JSONB to store multiple image credits)
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS inline_image_credits JSONB DEFAULT '{}';

-- Add comment for documentation
COMMENT ON COLUMN articles.featured_image_credit IS 'Credit/attribution for the featured image to avoid copyright issues';
COMMENT ON COLUMN articles.inline_image_credits IS 'JSON object storing credits for inline images with format: {"image_url": "credit_text"}';

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_articles_featured_image_credit ON articles(featured_image_credit);
CREATE INDEX IF NOT EXISTS idx_articles_inline_image_credits ON articles USING GIN(inline_image_credits);

-- Update the articles_with_details view to include image credits
DROP VIEW IF EXISTS articles_with_details;

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
    a.featured_image_credit,
    a.inline_image_credits,
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
    a.featured_image_credit,
    a.inline_image_credits,
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
COMMENT ON VIEW articles_with_details IS 'Comprehensive view combining articles with category, author, tag, and image credit information for easy querying';

-- Grant permissions
GRANT SELECT ON articles_with_details TO authenticated;
GRANT SELECT ON articles_with_details TO anon;
