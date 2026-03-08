# GH News Media — SEO Implementation Plan (Phased)

**Purpose:** Permanent fixes for all issues in [SEO-AUDIT-GOOGLE-NEWS-DISCOVER.md](./SEO-AUDIT-GOOGLE-NEWS-DISCOVER.md), in a clear order so the news site is robust for Google News and Google Discover.  
**Reference:** Audit doc = `docs/SEO-AUDIT-GOOGLE-NEWS-DISCOVER.md`

---

## How to use this plan

- **Phases are sequential.** Complete Phase 1 before Phase 2, etc.
- **Per task:** Do the code/configuration change → run checks under “Acceptance criteria” → mark done.
- **Before each phase:** Ensure the app builds (`npm run build`) and key pages load.
- **After each phase:** Deploy and verify live URLs (sitemap, RSS, a sample article).
- **Owner:** Assign someone (e.g. dev lead) to own the plan and tick off tasks.

---

## Phase overview

| Phase | Name | Goal | Est. effort |
|-------|------|------|--------------|
| **1** | Sitemaps & discovery | Sitemap + RSS return 200; sitemap index has no 404s | Small |
| **2** | Single NewsArticle schema | One JSON-LD per article; no duplicate/conflicting schema | Medium |
| **3** | Branding, sitemaps, robots, logs | One publisher name; correct news sitemap; clean robots; no SEO debug logs | Small |
| **4** | Dates & Publisher Center | ISO 8601 everywhere; visible date on article; Publisher Center set up | Small + manual |
| **5** | Google Indexing API | Auth + trigger on publish for fast indexing | Medium |
| **6** | Polish & monitoring | Optional tooling; image rules; E-E-A-T; Search Console | Ongoing |

---

## Phase 1 — Sitemaps & discovery

**Goal:** Google (and other crawlers) can reach your sitemap and RSS without 404s, and the sitemap index does not reference missing files.

### 1.1 Confirm sitemap and RSS are served (no rewrites to API)

- **Status:** Rewrites in `next.config.ts` were removed in the audit fix. Confirm they are still removed.
- **Check:** In `next.config.ts` there is no `rewrites()` that sends `/sitemap.xml` or `/rss.xml` to `/api/*`.
- **Verification:**
  - Run the app locally: `npm run build && npm run start`.
  - Open: `http://localhost:3000/sitemap.xml` and `http://localhost:3000/rss.xml`.
  - Both must return **HTTP 200** and valid XML (sitemap has `<urlset>`, RSS has `<rss>`).
- **If you still had rewrites:** Remove them so `src/pages/sitemap.xml.tsx` and `src/pages/rss.xml.tsx` are served at `/sitemap.xml` and `/rss.xml`.

**Acceptance criteria:** GET `/sitemap.xml` and GET `/rss.xml` return 200 and valid XML.

---

### 1.2 Fix sitemap index (only list existing sitemaps)

- **File:** `src/pages/sitemap-index.xml.tsx`
- **Change:** Remove entries that point to non-existent URLs. Keep only:
  - `sitemap.xml`
  - `news-sitemap.xml`
- **Implementation:**
  - Remove the block that generates `<sitemap>` entries for `category-sitemap-${category.slug}.xml`.
  - Remove the block that adds `static-pages-sitemap.xml`.
  - Optionally keep a short comment in the file: “Category/static sitemaps can be added later when routes exist.”
- **Verification:** Open `http://localhost:3000/sitemap-index.xml`. Every `<loc>` must be a URL that returns 200 (test `sitemap.xml` and `news-sitemap.xml`).

**Acceptance criteria:** Sitemap index contains only `/sitemap.xml` and `/news-sitemap.xml`; both URLs return 200.

---

### Phase 1 sign-off

- [ ] `/sitemap.xml` → 200, valid XML  
- [ ] `/rss.xml` → 200, valid XML  
- [ ] `/sitemap-index.xml` → 200, only links to existing sitemaps  
- [ ] After deploy: same checks on `https://ghnewsmedia.com`

---

## Phase 2 — Single NewsArticle schema per article

**Goal:** Each article page has exactly one NewsArticle JSON-LD block, with the best fields from both current components.

### 2.1 Create one unified article SEO component

- **New file:** `src/components/SEO/UnifiedArticleSEO.tsx` (or merge into `EnhancedArticleSEO.tsx` and deprecate `GoogleNewsSEO`).
- **Responsibilities (single component):**
  - All meta tags (title, description, canonical, OG, Twitter, article:*).
  - **One** `<script type="application/ld+json">` with a single NewsArticle object.
- **Schema content (merge from EnhancedArticleSEO + GoogleNewsSEO):**
  - `@context`, `@type`: `NewsArticle`.
  - `@id`, `url`, `headline`, `description`, `datePublished`, `dateModified` (both in **ISO 8601**).
  - `image`: ImageObject with `url`, `width`, `height`; use absolute URL.
  - `author`: Person with `name`, `url` (author page), optional `image`.
  - `publisher`: NewsMediaOrganization with **one** chosen name (see Phase 3), `url`, `logo` (ImageObject; logo URL must return 200).
  - `mainEntityOfPage`: WebPage with `@id` = article URL.
  - `articleSection`, `keywords` (from tags), `wordCount`, `inLanguage: "en-GB"`, `isAccessibleForFree: true`.
  - Optional: `speakable` (cssSelector for headline and body), `contentLocation` (Ghana) if you want.
- **Do not:** Output a second NewsArticle block or mix “GH News” and “GhNewsMedia” in the same block (use one name; Phase 3).

**Acceptance criteria:** Component renders one JSON-LD; validate with [Google Rich Results Test](https://search.google.com/test/rich-results) on a sample article URL.

---

### 2.2 Use the unified component on the article page

- **File:** `src/pages/[category]/[slug].tsx`
- **Change:**
  - Replace `<EnhancedArticleSEO article={article} />` and `<GoogleNewsSEO article={article} />` with a single component, e.g. `<UnifiedArticleSEO article={article} />`.
  - Ensure the unified component receives the same `article` prop (with all fields used for SEO).
- **Verification:** View page source on an article; search for `application/ld+json`. There must be **one** NewsArticle object (no second one from another component).

**Acceptance criteria:** Article page has one NewsArticle JSON-LD; Rich Results Test shows no duplicate or conflicting schema.

---

### 2.3 Deprecate or remove old components

- **Option A:** Remove imports and usage of `EnhancedArticleSEO` and `GoogleNewsSEO` from the article page only; keep the files for reference until Phase 3 is done (in case you copy more fields).
- **Option B:** Delete `GoogleNewsSEO.tsx` after the unified component is live and tested; merge any remaining logic into the unified component and then simplify or remove the old `EnhancedArticleSEO` if it’s redundant.

**Acceptance criteria:** No duplicate schema on any article; build passes; no broken imports.

---

### Phase 2 sign-off

- [ ] One JSON-LD NewsArticle per article page  
- [ ] Rich Results Test passes for a sample article  
- [ ] No duplicate or conflicting NewsArticle  
- [ ] Build succeeds; article pages render correctly

---

## Phase 3 — Branding, news sitemap, robots, debug logs

**Goal:** One consistent publisher name, correct news sitemap, clean robots.txt, no SEO debug logs in production.

### 3.1 Choose and apply one publisher name

- **Decision:** e.g. **“GH News”** for the product (what readers see) and **“GhNewsMedia”** only where legally needed (e.g. footer “© GhNewsMedia”). For **Google News, schema, and sitemaps use one name everywhere** — e.g. **“GH News”** in:
  - All JSON-LD (Organization, NewsMediaOrganization, NewsArticle publisher name).
  - All sitemaps: `<news:name>GH News</news:name>`.
  - Open Graph / Twitter: `site_name`, etc.
- **Files to update (search for “GhNewsMedia” and “GH News”):**
  - `next-seo.config.ts`
  - `src/components/SEO/UnifiedArticleSEO.tsx` (or the component you use)
  - `src/pages/sitemap.xml.tsx` (news publication name)
  - `src/pages/news-sitemap.xml.tsx`
  - `src/services/seoService.ts`, `src/services/advancedSEOService.ts`
  - Any remaining SEO components that output schema or meta.
- **Method:** Use “GH News” in all user-facing and crawler-facing places; keep “GhNewsMedia” only for legal/copyright if desired.

**Acceptance criteria:** Grep for “GhNewsMedia” and “GH News” in SEO/sitemap code; usage is consistent and intentional (no mixed publisher name in schema or sitemaps).

---

### 3.2 News sitemap: remove `news:stock_tickers` misuse

- **File:** `src/pages/news-sitemap.xml.tsx`
- **Change:** Remove the line that outputs `<news:stock_tickers>${...}</news:stock_tickers>` (currently filled with category name). Do not add it back unless you have real stock ticker symbols (e.g. for a business/finance section).
- **Keep:** `<news:publication>`, `<news:publication_date>`, `<news:title>`, `<news:keywords>` (and any other valid news tags you use).

**Acceptance criteria:** News sitemap has no `<news:stock_tickers>`; still validates as valid news sitemap XML.

---

### 3.3 robots.txt: remove Crawl-delay and RSS from Sitemap

- **File:** `src/pages/robots.txt.tsx`
- **Changes:**
  - Remove the line `Crawl-delay: 1` (and the comment if any).
  - Remove the line `Sitemap: ${baseUrl}/rss.xml`.
  - Keep: `Sitemap: sitemap.xml`, `sitemap-index.xml`, `news-sitemap.xml`.
- **Verification:** Request `/robots.txt`; confirm no Crawl-delay and no rss.xml in Sitemap list.

**Acceptance criteria:** robots.txt has no Crawl-delay; only real sitemap URLs in Sitemap:.

---

### 3.4 Remove or guard SEO debug logs

- **Files:** All SEO-related components (e.g. `ArticleSEO.tsx`, `EnhancedArticleSEO.tsx`, any that still log).
- **Change:** Remove `console.log('SEO Debug - Article:', ...)` or wrap in `if (process.env.NODE_ENV === 'development' || process.env.DEBUG_SEO === 'true')`.
- **Search:** `grep -r "console.log" src/components/SEO src/services/seoService.ts src/services/advancedSEOService.ts` and fix each.

**Acceptance criteria:** No SEO-related console.log in production build (or only when DEBUG_SEO is set).

---

### Phase 3 sign-off

- [ ] One publisher name in schema and sitemaps  
- [ ] News sitemap without stock_tickers  
- [ ] robots.txt cleaned  
- [ ] No SEO debug logs in production

---

## Phase 4 — Dates and Publisher Center

**Goal:** All dates in schema/meta are ISO 8601; article page shows a visible date; Publisher Center is set up for ghnewsmedia.com.

### 4.1 Normalize dates to ISO 8601 everywhere

- **Where dates are output:** Unified article SEO component, any remaining schema in `seoService.ts` / `advancedSEOService.ts`, and meta tags (e.g. `article:published_time`, `article:modified_time`).
- **Rule:** For any `publishedAt` or `updatedAt` sent to the client or in JSON-LD/meta, use:
  - `new Date(article.publishedAt).toISOString()` and `new Date(article.updatedAt).toISOString()` (or equivalent) so format is always `YYYY-MM-DDTHH:mm:ss.sssZ`.
- **Also ensure:** `dateModified` is present in the single NewsArticle block and reflects actual last update.

**Acceptance criteria:** View source and JSON-LD on an article; all date values are full ISO 8601.

---

### 4.2 Visible date on article page

- **Check:** Between the headline and the main article body there is a clear, visible publication (and ideally update) date.
- **Files:** Likely `ArticleHeader.tsx` or `ArticleMeta.tsx`. If the date is only in the footer or hidden, add or move it under the headline.
- **Recommendation:** e.g. “Published: 8 Mar 2025, 14:30 GMT” and “Updated: 9 Mar 2025” if you show updates.

**Acceptance criteria:** A human can see the publication date without scrolling to the footer; it matches the date in schema.

---

### 4.3 Publisher Center (manual)

- **URL:** [Google Publisher Center](https://publishercenter.google.com/).
- **Steps:**
  1. Add publication / property: `https://ghnewsmedia.com` (and www if you use it).
  2. Verify ownership (same as Search Console if possible).
  3. Set **publication name** to the same name used in schema and sitemaps (e.g. “GH News”).
  4. Set **primary language** (e.g. English) and **geographic focus** (e.g. Ghana).
  5. Add **sections/topics** (e.g. News, Politics, Sports, Business, Entertainment).
  6. Add contact / about URLs to match your site (about, contact).
- **Ongoing:** Keep contact and about info in sync with the site.

**Acceptance criteria:** Property verified; name and regions match the site; sections reflect your categories.

---

### Phase 4 sign-off

- [ ] All article dates in schema/meta are ISO 8601  
- [ ] Visible date on article page  
- [ ] Publisher Center configured and verified for ghnewsmedia.com

---

## Phase 5 — Google Indexing API (authenticated)

**Goal:** When an article is published (or updated), the site notifies Google via the Indexing API so new URLs are discovered quickly.

**Full setup guide:** See [docs/GOOGLE-INDEXING-API-SETUP.md](./GOOGLE-INDEXING-API-SETUP.md) for GCP project, service account, Search Console delegation, and env vars (`GOOGLE_INDEXING_CREDENTIALS_JSON` or `GOOGLE_APPLICATION_CREDENTIALS`).

### 5.1 Google Cloud and Indexing API

- Create (or use) a **Google Cloud project**.
- Enable **Indexing API** for the project.
- Create a **service account**; download JSON key.
- In **Search Console** → Settings → Users and permissions, add the **service account email** as a user with “Full” or at least “URL Inspection / Submit to Indexing” (if available). Alternatively add the service account as an owner for the property so it can use the Indexing API.

**Acceptance criteria:** Service account key exists; Indexing API enabled; service account has access in Search Console for ghnewsmedia.com.

---

### 5.2 Store credentials securely

- **Do not** commit the JSON key. Store it in:
  - **Production:** Env var (e.g. `GOOGLE_INDEXING_CREDENTIALS_JSON` as the raw JSON string) or a secret manager that injects the file path or content.
  - **Local:** `.env.local` (and add `.env.local` to `.gitignore` if not already).
- **Document:** In `docs/` or README, note that Indexing API requires `GOOGLE_INDEXING_CREDENTIALS_JSON` (or similar) and that the service account must be added in Search Console.

**Acceptance criteria:** Key is not in repo; app can read key from env at runtime.

---

### 5.3 Implement authenticated Indexing API call

- **File:** `src/services/googleIndexingService.ts` (or a new `googleIndexingApi.ts`).
- **Implementation:**
  - Use `google-auth-library` (already in package.json) to create a JWT client from the service account credentials.
  - Request an access token and send a POST to `https://indexing.googleapis.com/v3/urlNotifications:publish` with:
    - `Authorization: Bearer <access_token>`
    - Body: `{ "url": "<article absolute URL>", "type": "URL_UPDATED" }`
  - Handle errors (e.g. 403 = check Search Console permissions; 429 = rate limit).
- **Trigger:** Call this service when an article is **published** (and optionally when it’s meaningfully updated). Trigger from:
  - CMS “Publish” action (e.g. in `src/pages/admin/articles/` or `src/pages/cms/articles/` after a successful publish), or
  - A Supabase trigger / Edge Function that runs on insert/update of the articles table with `status = published`.
- **Fallback:** Keep sitemap ping as fallback when Indexing API fails or credentials are missing.

**Acceptance criteria:** Publishing an article results in one successful Indexing API request (check logs or a test run); no credentials in code.

---

### Phase 5 sign-off

- [ ] Indexing API enabled; service account has Search Console access  
- [ ] Credentials in env only; not in repo  
- [ ] Publish flow calls Indexing API; fallback to sitemap ping on failure  
- [ ] One test publish and verify in Search Console URL Inspection (indexing requested)

---

## Phase 6 — Polish and monitoring (ongoing)

**Goal:** Optional tooling, image and content quality, E-E-A-T, and monitoring so the site stays in good shape for News and Discover.

### 6.1 Optional: schema-dts and type-safe JSON-LD

- **Package:** `schema-dts` (npm).
- **Use:** When editing the unified NewsArticle block, use types from `schema-dts` (e.g. `NewsArticle`, `WithContext<NewsArticle>`) so TypeScript catches invalid or missing required fields.
- **Scope:** Refactor the single NewsArticle object to use these types; keep output as a single JSON object for `dangerouslySetInnerHTML` or next-seo.

**Acceptance criteria:** NewsArticle JSON-LD is built from schema-dts types; build passes; Rich Results Test still passes.

---

### 6.2 Image guidelines for Discover

- **Rule:** Featured images at least **1200 px wide** for best Discover eligibility.
- **Where to enforce:** In CMS or upload flow: validate or warn when featured image width &lt; 1200 px; recommend 1200×630 or similar for OG.
- **Docs:** Add a short note in your editorial or CMS docs: “Featured images should be at least 1200 px wide for Google Discover.”

**Acceptance criteria:** New articles are encouraged or required to use 1200px-wide featured images; documented.

---

### 6.3 E-E-A-T and trust

- **Authors:** Ensure author names and (if possible) author pages or bios are visible and match schema.
- **About / Contact:** Keep `/about` and `/contact` up to date and linked from footer/header.
- **Policies:** If you have editorial, ethics, or diversity pages, link them from footer and (optionally) from Organization schema.

**Acceptance criteria:** Author and about/contact info are clear and consistent with schema.

---

### 6.4 Search Console and monitoring

- **Sitemaps:** In Search Console, submit `https://ghnewsmedia.com/sitemap-index.xml` (or `sitemap.xml`) and fix any reported errors.
- **Coverage:** Periodically check Coverage (or URL Inspection) for article URLs to ensure they’re indexed.
- **Discover:** If available, check Discover performance report and fix policy or quality issues.
- **Optional:** Use Search Console API or a simple script to list indexing status for recent articles.

**Acceptance criteria:** Sitemaps submitted; no critical crawl errors; indexing status monitored for new articles.

---

### Phase 6 sign-off (ongoing)

- [ ] Optional schema-dts in place  
- [ ] Image width guideline documented and applied  
- [ ] E-E-A-T signals in place (authors, about, contact)  
- [ ] Search Console monitored; sitemaps and coverage healthy

---

## Quick reference: files to touch by phase

| Phase | Files |
|-------|--------|
| 1 | `next.config.ts` (verify), `src/pages/sitemap-index.xml.tsx` |
| 2 | New `UnifiedArticleSEO.tsx`, `src/pages/[category]/[slug].tsx`; deprecate/remove `GoogleNewsSEO` (and optionally `EnhancedArticleSEO`) |
| 3 | `next-seo.config.ts`, `UnifiedArticleSEO.tsx`, `sitemap.xml.tsx`, `news-sitemap.xml.tsx`, `seoService.ts`, `advancedSEOService.ts`, `robots.txt.tsx`, SEO components (debug logs) |
| 4 | UnifiedArticleSEO + any schema helpers (dates), `ArticleHeader`/`ArticleMeta` (visible date); Publisher Center (manual) |
| 5 | `googleIndexingService.ts` (or new API module), publish flow (admin/cms), env docs |
| 6 | Optional: schema-dts; CMS/docs (images, E-E-A-T); Search Console (manual/API) |

---

## Rollback and safety

- **Phase 1–3:** All changes are in code/config; revert via Git if something breaks. Keep a backup of `robots.txt` and sitemap index before editing.
- **Phase 4:** Publisher Center changes don’t affect code; you can adjust settings in Publisher Center at any time.
- **Phase 5:** If Indexing API causes issues, you can stop calling it and rely on sitemap ping; remove or comment out the call in the publish flow.
- **Phase 6:** Optional; no critical path.

---

## Success metrics (after full implementation)

- **Technical:** Sitemap and RSS 200; sitemap index has no 404s; one NewsArticle per article; no Crawl-delay; correct news sitemap; Indexing API called on publish.
- **Search Console:** Sitemaps submitted and processed; coverage errors resolved; new articles appear as “Indexed” or “Discovered” within a few days.
- **Google News / Discover:** Over time, articles eligible for News and Discover; monitor Publisher Center and Discover report for improvements.

When all phases are done, the site will have **permanent fixes** for the issues in the audit and a clear path to stay healthy for Google News and Discover.
