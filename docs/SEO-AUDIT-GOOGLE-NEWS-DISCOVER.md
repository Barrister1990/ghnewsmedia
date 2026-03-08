# GH News Media — SEO Audit: Google News & Google Discover Indexing

**Audit date:** March 2025  
**Site:** https://ghnewsmedia.com  
**Context:** ~8 months in operation, ~2 stories/day; not being indexed in Google News / Google Discover. Goal: identify weaknesses, loopholes, and actions to achieve indexing comparable to major news brands (e.g. BBC).

---

## Executive summary

The site has a solid base: NewsArticle schema, news sitemap, RSS, and article-level meta. Several **critical technical issues** are likely blocking or limiting Google News and Discover:

1. **Sitemap and RSS may be returning 404** due to `next.config` rewrites pointing to non-existent API routes.
2. **Sitemap index references URLs that do not exist** (category and static sitemaps), causing crawl errors and trust issues.
3. **Duplicate and inconsistent NewsArticle structured data** on article pages (two separate JSON-LD blocks).
4. **Google Indexing API is not authenticated**, so “immediate” indexing is not actually in use.
5. **Publisher Center** (and related trust/organization signals) are not clearly aligned with Google’s expectations.

Fixing these, then layering in Publisher Center, consistent branding, and optional SEO tooling should put the site in a much stronger position for News and Discover.

---

## 1. Critical issues (fix first)

### 1.1 Sitemap and RSS rewrites → 404

**Location:** `next.config.ts`

**Issue:**  
Rewrites send `/sitemap.xml` and `/rss.xml` to `/api/sitemap.xml` and `/api/rss.xml`. There are **no** API route handlers for those paths (only page components `sitemap.xml.tsx` and `rss.xml.tsx`). As a result, requests to:

- `https://ghnewsmedia.com/sitemap.xml`
- `https://ghnewsmedia.com/rss.xml`

may be served as **404**, so Google cannot discover or use your sitemap and RSS.

**Evidence:**

```31:37:next.config.ts
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap.xml',
      },
      {
        source: '/rss.xml',
        destination: '/api/rss.xml',
```

No `src/pages/api/sitemap.xml.ts` or `src/pages/api/rss.xml.ts` exists.

**Recommendation:**

- **Option A (recommended):** Remove these two rewrites so Next.js serves:
  - `src/pages/sitemap.xml.tsx` at `/sitemap.xml`
  - `src/pages/rss.xml.tsx` at `/rss.xml`
- **Option B:** If you prefer API routes, add real API handlers at `pages/api/sitemap.xml.ts` and `pages/api/rss.xml.ts` that return the same XML your current pages generate, and keep the rewrites.

After changing, verify in a browser and with `curl` that both URLs return **200** and valid XML.

---

### 1.2 Broken sitemap index (404s for child sitemaps)

**Location:** `src/pages/sitemap-index.xml.tsx`

**Issue:**  
The sitemap index references:

- `https://ghnewsmedia.com/category-sitemap-{slug}.xml` (per category)
- `https://ghnewsmedia.com/static-pages-sitemap.xml`

There are **no** pages or API routes for:

- `category-sitemap-*.xml`
- `static-pages-sitemap.xml`

So any crawler (including Google) that follows the sitemap index will get **404** for these URLs. That can:

- Trigger crawl errors in Search Console
- Reduce trust in your sitemap setup
- Waste crawl budget

**Recommendation:**

- **Short term:** Remove the sitemap index entries for category and static sitemaps so the index only lists **existing** sitemaps, e.g.:
  - `https://ghnewsmedia.com/sitemap.xml`
  - `https://ghnewsmedia.com/news-sitemap.xml`
- **Later:** If you want category/static sitemaps, add real routes (e.g. `category-sitemap-[slug].xml.tsx` and `static-pages-sitemap.xml.tsx`) that return valid XML, then add them back to the index.

---

### 1.3 Duplicate NewsArticle structured data on article pages

**Locations:**  
`src/pages/[category]/[slug].tsx` uses both:

- `EnhancedArticleSEO` (outputs one NewsArticle JSON-LD)
- `GoogleNewsSEO` (outputs a second NewsArticle JSON-LD)

**Issue:**  
Two separate NewsArticle JSON-LD blocks on the same page can:

- Confuse Google as to which is authoritative
- Look like duplicate/contradictory signals (e.g. different publisher names or dates)
- Hurt eligibility for News/Discover rich results

**Recommendation:**

- Use **one** component that outputs a **single** NewsArticle JSON-LD per article.
- Merge the best fields from `EnhancedArticleSEO` and `GoogleNewsSEO` (dates in ISO 8601, correct publisher logo, author, image, speakable, etc.) into that one block.
- Remove the other component from the article layout so each article page has exactly one NewsArticle schema.

---

### 1.4 Google Indexing API not authenticated

**Location:** `src/services/googleIndexingService.ts`

**Issue:**  
The Indexing API call has no `Authorization` header (commented as “Add in production”). Unauthenticated requests do not work, so “immediate” indexing via the API is not happening. Only sitemap ping (and any manual URL inspection in Search Console) is in effect.

**Recommendation:**

- To use the Indexing API:
  - Create a Google Cloud project and enable the Indexing API.
  - Use a service account with “Owner” or sufficient access to the Indexing API, and grant the service account’s email in Search Console as a “Delegate” for the property.
  - Store credentials securely (e.g. env vars or secret manager) and add server-side auth (e.g. `google-auth-library`) to send a Bearer token with each request.
- Document the flow (e.g. “on publish → call Indexing API for the article URL”) so new articles are submitted as `URL_UPDATED` right after publication.
- Keep sitemap ping as a fallback.

---

## 2. High‑priority issues

### 2.1 Publisher name and branding inconsistency

**Issue:**  
Mixed use of “GH News” vs “GhNewsMedia” across:

- `next-seo.config.ts`: “GH News”
- `ArticleSEO.tsx` / schema: “GhNewsMedia”
- `GoogleNewsSEO.tsx`: “GhNewsMedia” in schema, “GH News” in news sitemap
- Sitemaps: “GH News” in `<news:name>`

Google News and Discover rely on clear, consistent publisher identity.

**Recommendation:**

- Choose **one** official name (e.g. “GH News” for the product and “GhNewsMedia” for the company if needed) and use it consistently in:
  - All JSON-LD (Organization/NewsMediaOrganization and NewsArticle publisher)
  - All sitemaps (`<news:name>`)
  - Open Graph / Twitter meta
  - Publisher Center (see below)

---

### 2.2 Google Publisher Center not confirmed

**Issue:**  
Google News no longer requires a manual “application,” but **Publisher Center** is still where you:

- Declare publication details
- Set geographic and topical focus
- Manage branding and sometimes content labels

Sites that are not clearly set up in Publisher Center can be at a disadvantage for News and Discover.

**Recommendation:**

- In [Publisher Center](https://publishercenter.google.com/), add and verify the property `https://ghnewsmedia.com` (and any www variant you use).
- Use the **same** publication name and branding as in your schema and sitemaps.
- Set:
  - Primary language (e.g. English)
  - Geographic focus (e.g. Ghana)
  - Main topics/sections (news, politics, sports, etc.)
- Ensure contact and “About” information match your site (e.g. about page, contact page).

---

### 2.3 News sitemap: misuse of `news:stock_tickers`

**Location:** `src/pages/news-sitemap.xml.tsx`

**Issue:**  
`<news:stock_tickers>` is populated with `article.category.name` (e.g. “Sports”, “Politics”). This element is intended for **stock ticker symbols** (e.g. NASDAQ:AAPL), not section names. Misuse can confuse Google’s parsing and looks unprofessional.

**Recommendation:**

- Remove `<news:stock_tickers>` from the news sitemap unless you have real stock tickers for financial articles.
- Keep `<news:keywords>` and other valid news sitemap fields.

---

### 2.4 Article date format and visibility

**Requirement (Google):**  
Publication (and ideally modification) dates in ISO 8601, and a **visible** date between headline and body.

**Current state:**  
Structured data uses `publishedAt` / `updatedAt`; ensure they are always full ISO 8601 (e.g. `YYYY-MM-DDTHH:mm:ss.sssZ`). Also confirm the article UI shows a clear, visible date near the headline (your `ArticleHeader` / `ArticleMeta` should already do this; just verify on a few URLs).

**Recommendation:**

- Normalize all dates sent in JSON-LD and meta to ISO 8601 (e.g. `new Date(article.publishedAt).toISOString()`).
- Ensure `dateModified` is present and accurate.
- Keep visible date on the page; avoid “date only in footer” or hidden in markup.

---

### 2.5 robots.txt: Crawl-delay and RSS as Sitemap

**Location:** `src/pages/robots.txt.tsx`

**Issues:**

- **Crawl-delay: 1** — Only respected by some crawlers (e.g. Bing); Google ignores it. It can slow down Bing and other bots without helping Google. Consider removing it unless you have a specific reason to throttle.
- **RSS listed as Sitemap** — `rss.xml` is not a sitemap format. Listing it under `Sitemap:` is non-standard. Prefer keeping only real sitemap URLs in `Sitemap:` and referencing RSS in your HTML (e.g. `<link rel="alternate" type="application/rss+xml" href="...">`), which you already do.

**Recommendation:**

- Remove `Crawl-delay: 1`.
- Remove the line `Sitemap: ${baseUrl}/rss.xml` from robots.txt; keep `Sitemap:` only for `sitemap.xml`, `sitemap-index.xml`, and `news-sitemap.xml` (and any other real sitemaps you add later).

---

### 2.6 Debug and development code in production

**Locations:**  
e.g. `src/components/SEO/ArticleSEO.tsx` (and any similar components still in use).

**Issue:**  
`console.log('SEO Debug - Article:', ...)` and similar logs can clutter production and leak internal field values.

**Recommendation:**

- Remove or guard all SEO debug logs (e.g. only run when `process.env.NODE_ENV === 'development'` or a custom `DEBUG_SEO` env is set).

---

## 3. Google News technical guidelines (checklist)

Use this to verify ongoing compliance:

| Requirement | Status / note |
|-------------|----------------|
| Permanent URLs for articles | ✅ `/[category]/[slug]` |
| Articles reachable via HTML links (not only JS) | ✅ Server-rendered links |
| No blocking of article paths in robots.txt | ✅ Article paths allowed |
| No blocking via meta robots on article pages | ✅ index, follow |
| Single language per article | ✅ en-GB |
| Structured data with ISO 8601 dates | ⚠️ Ensure everywhere; fix duplicates |
| Visible date between headline and body | Verify in UI |
| Author info and bylines | ✅ Author in schema and UI |
| Publisher and logo in schema | ⚠️ Unify name; ensure logo URL returns 200 |
| News sitemap with &lt;news:news&gt; | ✅ Present; fix stock_tickers |
| Sitemap and RSS reachable (200) | ❌ Fix rewrites and broken index |

---

## 4. Google Discover considerations

Discover does not have a separate “application”; eligibility is largely automatic if:

- Content is **indexed** by Google.
- Content meets **Discover policies** (no dangerous/deceptive/violent/vulgar content, clear ads/sponsorship).
- Site is seen as a **trusted source** (E-E-A-T, consistent quality, low spam risk).
- **Images** are at least **1200 px wide** where possible (especially featured images).

**Recommendations:**

- Fix all critical issues above so that sitemaps and structured data are correct and crawlable; this supports indexing and trust.
- Ensure every article has a **high-quality featured image** (min width 1200 px, good aspect ratio for cards).
- Strengthen E-E-A-T: clear author bios, “About” and “Contact” pages, consistent publication name, and transparent editorial/ethics if you have them.
- Avoid clickbait headlines and thin content; focus on original, substantive articles.

---

## 5. SEO libraries and tooling (optional but useful)

You already use **next-seo**; the following can complement it for news/technical SEO:

| Library / tool | Purpose | Use case |
|----------------|--------|----------|
| **next-seo** (current) | Meta tags, Open Graph, Twitter, JSON-LD helpers | Keep; consolidate to one Article component. |
| **@next/sitemap** (optional) | Generate sitemap(s) and index from config or data | Could replace custom sitemap pages and avoid rewrite/404 issues. |
| **schema-dts** (npm) | TypeScript types for Schema.org JSON-LD | Safer, type-checked NewsArticle and Organization. |
| **Google Search Console API** | URL Inspection, indexing status | Monitor indexing and surface crawl errors. |
| **Google Indexing API** (server-side) | Notify Google of new/updated URLs | Fast discovery of new articles once auth is in place. |

Suggested next steps:

- Add **schema-dts** when refactoring to a single NewsArticle block (better type safety and fewer schema mistakes).
- Consider **@next/sitemap** if you want sitemaps generated at build time and a single source of truth for URLs.
- After fixing rewrites and sitemap index, use **Search Console** (and optionally the API) to confirm sitemap discovery and coverage.

---

## 6. Recommended action order

1. **Immediate**
   - Fix sitemap and RSS availability (remove or correct rewrites; verify 200 and valid XML).
   - Fix sitemap index (only list existing sitemaps; or add missing routes).
   - Consolidate to one NewsArticle JSON-LD per article and remove duplicate component.
2. **Short term**
   - Unify publisher name and branding everywhere (schema, sitemaps, OG, Publisher Center).
   - Remove `news:stock_tickers` from news sitemap; ensure dates are ISO 8601 everywhere.
   - Clean robots.txt (remove Crawl-delay and rss from Sitemap list); remove SEO debug logs.
   - Add and complete Publisher Center for ghnewsmedia.com.
3. **Next**
   - Implement Google Indexing API with proper service-account auth and trigger on publish.
   - Optionally introduce schema-dts and/or @next/sitemap for maintainability and correctness.
   - Monitor Search Console for indexing, coverage, and Discover performance.

---

## 7. Summary table

| Area | Severity | Main issue | Action |
|------|----------|------------|--------|
| Sitemap / RSS | Critical | Rewrites → 404 | Remove rewrites or add real API routes; verify 200 |
| Sitemap index | Critical | 404s for category/static sitemaps | Remove broken entries or add real sitemaps |
| Structured data | Critical | Two NewsArticle blocks per article | Single component, one JSON-LD |
| Indexing API | High | Not authenticated | Add service account auth and use on publish |
| Branding | High | GH News vs GhNewsMedia | Pick one and use everywhere |
| Publisher Center | High | Not confirmed | Add site, verify, complete profile |
| News sitemap | Medium | stock_tickers misuse | Remove or use only for real tickers |
| robots.txt | Medium | Crawl-delay; RSS as Sitemap | Clean up |
| Debug code | Low | console.log in production | Remove or guard |
| Images / E-E-A-T | Ongoing | Discover and trust | 1200px images; strong author/about pages |

---

*End of audit. Re-run checks after each change (sitemap/RSS URLs, Search Console coverage, and a few sample article URLs in Rich Results Test / URL Inspection).*
