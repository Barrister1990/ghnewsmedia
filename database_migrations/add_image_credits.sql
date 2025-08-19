-- Migration: Add Image Credits Support
-- Date: 2024
-- Description: Add support for storing image credits to avoid copyright issues

-- Add image_credits column to articles table
-- This will store a JSON object with image URLs as keys and credits as values
ALTER TABLE articles 
ADD COLUMN image_credits JSONB DEFAULT '{}';

-- Add index for better query performance
CREATE INDEX idx_articles_image_credits ON articles USING GIN (image_credits);

-- Add comment for documentation
COMMENT ON COLUMN articles.image_credits IS 'JSON object storing image credits: {"image_url": "credit_text"}';

-- Example usage:
-- UPDATE articles 
-- SET image_credits = '{"https://example.com/image1.jpg": "Photo by John Doe on Unsplash", "https://example.com/image2.jpg": "© Company Name"}'
-- WHERE id = 'article_id';

-- Query to get all images with credits for an article:
-- SELECT image_credits FROM articles WHERE id = 'article_id';

-- Query to find articles using a specific image:
-- SELECT id, title FROM articles WHERE image_credits ? 'https://example.com/image.jpg';
