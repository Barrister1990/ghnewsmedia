# Modern News Website Best Practices — Ghana Point Audit (October 2026)

This document lists what Google Search, Google News, Discover and Publisher Center expect from a news
site, checks **ghanapoint.com** against each item, and records what was fixed in code and what still
needs a human to do it.

Status key: ✅ already correct · 🔧 fixed in this pass · 👤 needs action by the site owner

Sources (all checked October 2026):

- Google News policies (transparency): https://support.google.com/news/publisher-center/answer/6204050
- Google News technical guidelines: https://support.google.com/news/publisher-center/answer/9606708
- Best practices for article pages (dates, bylines): https://support.google.com/news/publisher-center/answer/9607104
- News sitemaps: https://developers.google.com/search/docs/crawling-indexing/sitemaps/news-sitemap
- Build and submit a sitemap: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Article structured data: https://developers.google.com/search/docs/appearance/structured-data/article
- Discover: https://developers.google.com/search/docs/appearance/google-discover
- Indexing API scope: https://developers.google.com/search/apis/indexing-api/v3/quickstart
- Understanding the sources behind Google News: https://developers.google.com/search/blog/2021/06/google-news-sources

---

## 1. One canonical host (no www / old-domain mismatch)

| Practice | Status | Notes |
| --- | --- | --- |
| Every URL resolves to `https://ghanapoint.com` (no www) | ✅ | `src/middleware.ts` 301-redirects `www.ghanapoint.com`, `ghnewsmedia.com` and `www.ghnewsmedia.com`, keeping the path. Verified. |
| All canonical tags, sitemaps, RSS and schema use the same host | ✅ | Everything is built from `SITE_URL` in `src/config/site.ts`. The sitemap check found 0 non-canonical URLs. |
| Pages with no canonical of their own don't inherit a wrong one | 🔧 | `DefaultSeo` used to give every page `canonical = homepage`. That default is gone. |
| Only one URL per section page | 🔧 | `/_category/sports`, `/Sports`, `/feature` and `/category/sports` now 301/308 to the single real URL. |
| Only one URL per article | ✅ | A wrong category in the URL 301s to the correct `/{category}/{slug}`. |
| `?page=1` and junk page numbers collapse to the base URL | ✅ | Done in the pagination work. |
| 👤 Host-level redirect | 👤 | Also configure www → apex and old domain → new domain at the host/DNS (Vercel domain settings) so redirects happen even before the app runs. Keep the old domain registered and redirecting for at least 12 months. |

## 2. robots.txt and crawl control

| Practice | Status | Notes |
| --- | --- | --- |
| A single `User-agent: *` group | 🔧 | robots.txt had a separate `User-agent: Googlebot` group. Google obeys only the most specific matching group, so it was ignoring every `Disallow` rule. |
| Don't block pages you want removed; use `noindex` | 🔧 | Blocking `/cms` and `/admin` in robots.txt causes "Indexed, though blocked by robots.txt" warnings. They are now crawlable but return `X-Robots-Tag: noindex, nofollow` (set in `next.config.ts`), as do `/auth`, `/email-verification` and `/test-tiptap`. |
| Block only non-HTML endpoints | 🔧 | Only `/api/` is disallowed now. |
| Sitemaps listed in robots.txt | ✅ | Lists `sitemap-index.xml`, `sitemap.xml` and `news-sitemap.xml`. |
| Article directories never blocked | ✅ | |

## 3. Sitemaps

| Practice | Status | Notes |
| --- | --- | --- |
| Main sitemap lists every canonical, indexable URL | ✅ | 1,240 URLs: home, sections, static pages, author pages and 1,222 articles. |
| `<lastmod>` is accurate, or left out | 🔧 | Static pages, sections and the homepage used to claim "modified right now" on every request. Google ignores `lastmod` on sites where it isn't reliable. Now: articles use `updated_at`, sections and authors use their newest story, the homepage uses the newest story, and static pages omit it. |
| No `changefreq` / `priority` | 🔧 | Google ignores both, so they were removed. |
| All values XML-escaped | 🔧 | Locations are now escaped too, not just titles. |
| Image sitemap tags | 🔧 | Each article includes its featured image (`image:image`). The placeholder image is never listed. |
| Correct content type | 🔧 | `application/xml; charset=utf-8`. |
| News sitemap: only the last 48 hours, ≤ 1,000 entries | 🔧 | The cap was added. An empty news sitemap on quiet days is normal; Google says it causes no problems. |
| News sitemap: required tags only | 🔧 | `news:keywords` removed (not part of Google's current spec). `news:name` is exactly **Ghana Point**, matching `PUBLICATION_NAME` and Publisher Center. |
| Sitemap index | 🔧 | The fake "now" `lastmod` values were removed. |
| 👤 Submit in Search Console | 👤 | Submit `https://ghanapoint.com/sitemap-index.xml` and `https://ghanapoint.com/news-sitemap.xml` on the ghanapoint.com property. Remove old sitemaps from the ghnewsmedia.com property after the change of address. |

## 4. Fast discovery of new stories

| Practice | Status | Notes |
| --- | --- | --- |
| Don't use the Indexing API for news | 🔧 | Google restricts it to `JobPosting` and livestream pages and warns that abuse can get access revoked. All Indexing API calls were removed (`googleIndexingService.ts` deleted). |
| Don't rely on sitemap "ping" URLs | 🔧 | `google.com/ping` and `bing.com/ping` were retired in 2023 and return errors. All ping code was removed. |
| WebSub on the RSS feed | 🔧 | `rss.xml` advertises `https://pubsubhubbub.appspot.com/` as its hub. On publish, the server tells the hub, which pushes the new items to subscribers, Google included. |
| IndexNow for Bing/Yandex | 🔧 (optional) | Set `INDEXNOW_KEY` (any 32-character hex string) in the hosting environment to switch it on. The key is served automatically at `/indexnow-key.txt`. |
| Publishing refreshes cached pages immediately | 🔧 | Publishing from the editor or from the article list (quick Publish/Unpublish) calls `/api/notify-indexing`. That regenerates the article, the homepage and `/authors`, then notifies WebSub. |
| No crawl-trigger on every reader view | 🔧 | Article pages used to POST to the indexing API on every view of a new story. That was removed. |

## 5. Article pages (Google News technical + transparency guidelines)

| Practice | Status | Notes |
| --- | --- | --- |
| Unique, permanent URL per article | ✅ | `/{category}/{slug}`. |
| Article text in server HTML, not built by JavaScript | ✅ | ISR pages render the full body on the server. |
| One clear headline (H1) that matches `<title>` and `og:title` | 🔧 | Titles used to be cut with "…" at about 55 characters. The `<title>`, `og:title` and schema `headline` now carry the full headline (" \| Ghana Point" is added only when it fits). |
| Visible date and time between headline and body | 🔧 | The byline only showed the date. It now reads "Published On 13 Sept 2026, 21:32 GMT", plus an "Updated" time for real updates. |
| Byline that links to an author bio page | ✅ | Linked to `/author/{id}`. Profile pages carry `ProfilePage` + `Person` schema. |
| Opinion labelled as opinion | ✅ | The section label appears above the headline; the editorial policy explains it. |
| Ads clearly labelled and separate | ✅ | `AdSlot` shows "Advertisement". |
| Don't artificially refresh dates | 👤 | Unpublishing and re-publishing an article from the list resets `published_at` to now. Avoid it for old stories, or correct a story in place and let "Updated" show. |

## 6. Structured data

| Practice | Status | Notes |
| --- | --- | --- |
| One `NewsArticle` per article page | ✅ | Unused duplicate generators deleted (`ArticleSEO`, `EnhancedArticleSEO`, `GoogleNewsSEO`, `WebsiteSEO`, `seoService`, `dynamicSitemapGenerator`). |
| `headline`, `datePublished`, `dateModified` with timezone | ✅ | ISO 8601 UTC. |
| `image` as a list of real, crawlable URLs | 🔧 | Was a single object with hard-coded "1200×630" whatever the real size. Now an array of the real image URL. |
| `author` as `Person` with `url`, `jobTitle`, valid `sameAs` | 🔧 | `jobTitle` added. `sameAs` used to produce broken links like `https://facebook.com/https://…` when the profile stored a full URL; fixed on both the article and author pages. |
| `publisher` logo exists | 🔧 | Schema pointed at `/logo.png`, which didn't exist. A 600×600 Ghana Point logo is now generated. |
| Organization `sameAs` lists only real profiles | 🔧 | Previously listed Instagram and LinkedIn accounts that don't exist. Now Facebook, X, YouTube and the WhatsApp channel, all in `SOCIAL_PROFILES` in `src/config/site.ts`. |
| Organization policy links resolve | 🔧 | `publishingPrinciples`, `ethicsPolicy` and `diversityPolicy` pointed at pages that returned 404. They now point to sections of the new `/editorial-policy` page, along with `correctionsPolicy`, `verificationFactCheckingPolicy`, `ownershipFundingInfo` and `masthead`. |
| Article pages on error don't emit article schema | 🔧 | `ArticleNotFound` used to emit a fake "Article Not Found" `NewsArticle`. It now renders a `noindex` page. |
| 👤 Validate | 👤 | After deploying, run 3–4 article URLs through https://search.google.com/test/rich-results and the homepage through https://validator.schema.org. |

## 7. Meta robots, images and Discover

| Practice | Status | Notes |
| --- | --- | --- |
| `max-image-preview:large` on every indexable page | 🔧 | The homepage and static pages were missing it (needed for large Discover cards). It is now set through one shared `ROBOTS_PROPS` value. |
| One robots meta tag per page | 🔧 | Article pages had three robots/googlebot tags. Now one. |
| Error and utility pages `noindex` | 🔧 | 404, search, and the "category not found" / error states. |
| Errors return a retryable status | 🔧 | Category and Latest News pages used to return HTTP 200 with an error message, which Google can index or report as a "soft 404". They now return 503, so Google retries. |
| Large article images (≥ 1200 px wide, 16:9) | 👤 | The site passes through whatever is uploaded. Ask editors to upload featured images at least 1200×675. Small images are the main reason stories miss Discover. |
| No logos or text-heavy images as article images | 👤 | Editorial practice. |
| Default share image matches the brand | 🔧 | `og-image.jpg`, `twitter-image.jpg`, all favicons and the app icons still showed the old **GH News Media** logo. All were regenerated with the Ghana Point brand, and the web manifest was updated. |

## 8. Site-level transparency (Google News policy)

| Practice | Status | Notes |
| --- | --- | --- |
| About page | ✅ | `/about`, now linking to the editorial policy. |
| Contact page with non-generic contact details | ✅ | `/contact` with email and phone. |
| Staff list and bios | ✅ | `/authors` and `/author/{id}`. |
| Editorial standards, corrections, fact-checking, labelling | 🔧 | New `/editorial-policy` page, linked from the footer, the About page and the sidebar of every static page, and listed in the sitemap. |
| Ownership and funding disclosed | 🔧 👤 | The policy has an Ownership section. **Edit `PUBLISHER_ENTITY` at the top of `src/pages/editorial-policy.tsx` to the registered company or owner name.** Google wants the real publisher named. |
| Author bios have real detail | 👤 | Fill in bio and title for every author in the admin. Empty profiles weaken trust signals. Replace "GH News Media" wording in category descriptions and author bios with "Ghana Point". |

## 9. Performance and page experience (from earlier work)

| Practice | Status | Notes |
| --- | --- | --- |
| Server-rendered, cached pages (ISR/SSR + CDN cache headers) | ✅ | |
| Optimised images (`next/image`, sizes, lead image preloaded) | ✅ | |
| CLS ≈ 0, Lighthouse SEO 100 | ✅ | See the earlier speed work. |
| Third-party scripts after hydration | ✅ | GA and AdSense use `afterInteractive`. |

---

## Owner checklist (do these in order after deploying)

1. **Deploy** this build to production.
2. **Host redirects:** in Vercel → Domains, set `ghanapoint.com` as primary, redirect `www.ghanapoint.com` → `ghanapoint.com` (308), and redirect `ghnewsmedia.com` and `www.ghnewsmedia.com` → `ghanapoint.com`.
3. **Check these URLs return 200 and look right:** `/robots.txt`, `/sitemap-index.xml`, `/sitemap.xml`, `/news-sitemap.xml`, `/rss.xml`, `/logo.png`, `/og-image.jpg`, `/editorial-policy`.
4. **Search Console (ghanapoint.com, Domain property):** submit `sitemap-index.xml` and `news-sitemap.xml`.
5. **Search Console (ghnewsmedia.com property):** Settings → Change of address → ghanapoint.com. (This needs the redirects from step 2 live first.)
6. **Publisher Center:** update the publication URL to `https://ghanapoint.com`, the name to **Ghana Point**, and the logo to `https://ghanapoint.com/logo.png`; add sections matching the site; link the About and Editorial Policy pages.
7. **Edit `PUBLISHER_ENTITY`** in `src/pages/editorial-policy.tsx` to the legal owner name.
8. **Optional:** set `INDEXNOW_KEY` in the hosting environment for faster Bing indexing. You can also set `INDEXING_NOTIFY_API_KEY` to lock down `/api/notify-indexing`.
9. **Validate:** Rich Results Test on a few articles; URL Inspection → "Test live URL" on a new story; confirm "Page is indexable" with the canonical as `https://ghanapoint.com/...`.
10. **Watch for 2–4 weeks:** Search Console → Pages (indexing), Sitemaps, Enhancements, and the "News" / "Discover" performance reports.

## What to expect over the next month

- **Week 1:** Google re-crawls robots.txt and the sitemaps and starts following the 301s. Old-domain URLs begin to be replaced by ghanapoint.com URLs. New stories should be crawled within minutes through the news sitemap and WebSub.
- **Weeks 2–4:** Most indexed URLs move to the new domain. Some "Page with redirect" and "Alternate page with proper canonical tag" entries in the Pages report are **expected and not errors**. They show the old URLs being consolidated.
- **Google News / Discover:** there is no application step. Inclusion is automatic for sites that follow the policies above and publish regularly. Consistent daily publishing with original reporting, clear bylines and large images is what moves this; no technical setting can guarantee it inside a fixed time.

## Errors you should no longer see

| Search Console message | Cause that was removed |
| --- | --- |
| Duplicate, Google chose different canonical than user | Category pages reachable at several URLs; pages inheriting the homepage canonical |
| Indexed, though blocked by robots.txt | `/cms` and `/admin` blocked instead of `noindex` |
| Soft 404 | Error states returning 200 |
| Structured data: invalid `logo` / unreachable URL | Missing `/logo.png`, 404 policy URLs |
| Sitemap: invalid date / ignored lastmod | Fake "now" `lastmod` values |
