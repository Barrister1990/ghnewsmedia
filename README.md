# GhNewsMedia - Modern News Platform

A professional news website built with Next.js, featuring advanced SEO optimization, real-time content management, and social media integration.

## ✨ Features

- **Modern News Platform** with article management
- **SEO Optimized** with automatic search engine indexing
- **Social Media Ready** with optimized previews
- **Admin Dashboard** for content management
- **Real-time Comments** and article reactions
- **Category & Tag System** for content organization
- **Author Profiles** and bio pages
- **Responsive Design** for all devices
- **Search Functionality** with filters

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **SEO**: next-seo + Custom optimization
- **Deployment**: Vercel

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd ghnewsmedia
npm install
```

### 2. Environment Setup

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```


### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your news platform.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx           # Homepage
│   ├── news/
│   │   └── [slug]/
│   │       └── page.tsx   # Article pages
│   ├── category/
│   │   └── [slug]/
│   │       └── page.tsx   # Category pages
│   └── api/               # API routes
│       ├── sitemap.xml/
│       └── rss.xml/
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── SEO/               # SEO components
│   ├── admin/             # Admin components
│   └── layout/            # Layout components
├── lib/
│   ├── supabase.ts        # Supabase client
│   ├── seo.ts             # SEO utilities
│   └── utils.ts           # Helper functions
└── types/
    └── database.ts        # TypeScript types
```

## 🎯 Key Features Implementation

### SEO Optimization

The platform includes comprehensive SEO features:

- **Dynamic Meta Tags** for each article
- **Structured Data** (JSON-LD) for search engines
- **Auto-generated Sitemaps** (`/sitemap.xml`)
- **RSS Feeds** (`/rss.xml`)
- **Social Media Optimization** (Open Graph, Twitter Cards)
- **Search Engine Indexing** notifications

### Content Management

- **Rich Text Editor** for article creation
- **Media Upload** with image optimization
- **Category Management** with color coding
- **Tag System** for content organization
- **Draft/Published** status workflow

### User Experience

- **Fast Loading** with Next.js optimization
- **Mobile Responsive** design
- **Search Functionality** with real-time results
- **Comment System** with nested replies
- **Article Reactions** (likes, hearts, etc.)

## 🚀 Deployment

### Deploy to Vercel

1. **Connect to Vercel**:
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Add Environment Variables** in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL`

3. **Deploy**:
   ```bash
   vercel --prod
   ```

### Domain Setup

1. Add your custom domain in Vercel
2. Update `NEXT_PUBLIC_SITE_URL` to your domain
3. Update Supabase authentication settings

## 🔧 Configuration

### SEO Configuration

Edit `lib/seo.ts` to customize SEO settings:

```typescript
export const siteConfig = {
  name: "GhNewsMedia",
  description: "Ghana's Premier News Source",
  url: "https://ghnewsmedia.com",
  ogImage: "https://ghnewsmedia.com/og-image.jpg",
  twitter: "@GhNewsMedia",
};
```

### Styling Customization

The project uses Tailwind CSS. Customize colors in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#eff6ff',
        500: '#3b82f6',
        900: '#1e3a8a',
      },
    },
  },
},
```

## 📊 Analytics & Monitoring

### Google Analytics Setup

1. Add your GA4 measurement ID to `lib/analytics.ts`
2. Include the tracking script in `app/layout.tsx`

### Search Console Setup

1. Verify your domain in Google Search Console
2. Submit your sitemap: `https://yourdomain.com/sitemap.xml`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Open an issue on GitHub
- Email: support@ghnewsmedia.com

---

**Built with Next.js and ❤️**