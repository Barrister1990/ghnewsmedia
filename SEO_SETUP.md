
# SEO Setup Instructions for GhNewsMedia

## Overview
This document outlines the comprehensive SEO implementation for GhNewsMedia, including dynamic meta tags, structured data, sitemap generation, and Google indexing optimization.

## Components Implemented

### 1. SEO Components
- **SEOHead**: Dynamic meta tag generation with Open Graph and Twitter Cards
- **BreadcrumbSEO**: Breadcrumb navigation with structured data
- **Structured Data**: JSON-LD implementation for NewsArticle, Organization, and WebSite schemas

### 2. Updated Pages
All pages now include comprehensive SEO:
- **Index**: Homepage with organization and website schema
- **ArticlePage**: Full article SEO with NewsArticle schema and breadcrumbs
- **CategoryPage**: Category listing with CollectionPage schema
- **AuthorPage**: Author profiles with Person schema
- **NotFound**: 404 page with appropriate meta tags

### 3. Sitemap Generation
- **Script**: `scripts/generate-sitemap.js`
- **Output**: Generates `sitemap.xml` and `robots.txt` in the `dist/` folder
- **Features**: Includes news sitemap tags, proper priorities, and change frequencies

## Build Setup

### 1. Add to package.json scripts:
```json
{
  "scripts": {
    "generate-sitemap": "node scripts/generate-sitemap.js",
    "build": "vite build && npm run generate-sitemap"
  }
}
```

### 2. Manual Sitemap Generation
Run the sitemap generation script manually:
```bash
node scripts/generate-sitemap.js
```

### 3. Production Deployment
1. Build the application: `npm run build`
2. The sitemap will be automatically generated in the `dist/` folder
3. Deploy the `dist/` folder to your web server
4. Ensure `sitemap.xml` and `robots.txt` are accessible at the root domain

## SEO Features Implemented

### ✅ Dynamic Meta Tags
- Title tags with proper formatting
- Meta descriptions (160 char limit)
- Canonical URLs for all pages
- Open Graph tags for social media
- Twitter Card tags
- Article-specific meta tags (author, published time, etc.)

### ✅ Structured Data (JSON-LD)
- **NewsArticle** schema for all articles
- **Organization** schema for the news site
- **WebSite** schema with search functionality
- **Person** schema for author pages
- **CollectionPage** schema for category pages
- **BreadcrumbList** schema for navigation

### ✅ Internal Linking
- Breadcrumb navigation on all pages
- Related articles section
- Author and category cross-links
- Search functionality promotion

### ✅ Technical SEO
- Proper HTML semantics
- Responsive design
- Fast loading times
- Crawlable URLs
- Robot-friendly structure

### ✅ Sitemap & Robots
- XML sitemap with news tags
- Robots.txt with sitemap reference
- Proper crawl directives
- Priority and change frequency settings

## Google Search Console Setup

1. **Verify Domain**: Add your domain to Google Search Console
2. **Submit Sitemap**: Submit `https://yourdomain.com/sitemap.xml`
3. **Request Indexing**: Use the URL inspection tool for important pages
4. **Monitor Performance**: Track impressions, clicks, and rankings

## Production Considerations

### Supabase Integration
When connecting to Supabase, update the sitemap generation script to:
1. Fetch real article data from your Supabase database
2. Include actual publication dates and update frequencies
3. Generate the sitemap dynamically based on your content

### Environment Variables
Set up proper environment variables for:
- Site URL (production vs staging)
- Supabase connection details
- Social media handles

### Automation
Consider setting up automated sitemap generation:
- On content updates via webhooks
- Daily/weekly via cron jobs
- As part of your CI/CD pipeline

## Testing Checklist

- [ ] All pages load with proper meta tags
- [ ] Structured data validates (use Google's Rich Results Test)
- [ ] Sitemap is accessible and valid
- [ ] Robots.txt is properly configured
- [ ] Social media previews work correctly
- [ ] Breadcrumbs display and function properly
- [ ] Internal links are working
- [ ] Page loading speeds are optimized

## Next Steps

1. Deploy the application with SEO components
2. Submit to Google Search Console
3. Monitor search performance
4. Update sitemap generation for production data
5. Implement real-time sitemap updates when content changes

This implementation provides a solid foundation for excellent search engine visibility and social media sharing capabilities.
