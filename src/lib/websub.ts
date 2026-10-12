import { SITE_DOMAIN, SITE_URL } from '@/config/site';

/** Google's public WebSub hub; advertised in rss.xml so subscribers (incl. Google) get pushed updates. */
export const WEBSUB_HUB_URL = 'https://pubsubhubbub.appspot.com/';

/** Feeds that list new articles; the hub re-fetches them when we publish. */
const FEED_URLS = [`${SITE_URL}/rss.xml`];

/** Tell the WebSub hub our feed changed so it can push the new items immediately. */
export async function publishToWebSub(): Promise<boolean> {
  const results = await Promise.allSettled(
    FEED_URLS.map((feedUrl) =>
      fetch(WEBSUB_HUB_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ 'hub.mode': 'publish', 'hub.url': feedUrl }).toString(),
      })
    )
  );
  // The hub answers 204 No Content on success.
  return results.every((r) => r.status === 'fulfilled' && r.value.ok);
}

/**
 * Submit changed URLs to IndexNow (Bing, Yandex, Seznam, Naver). Google does not use IndexNow.
 * Skipped unless INDEXNOW_KEY is set; pages/indexnow-key.txt.tsx serves the key for verification.
 */
export async function submitToIndexNow(urls: string[]): Promise<'ok' | 'failed' | 'skipped'> {
  const key = process.env.INDEXNOW_KEY;
  if (!key || urls.length === 0) return 'skipped';
  try {
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: SITE_DOMAIN,
        key,
        keyLocation: `${SITE_URL}/indexnow-key.txt`,
        urlList: urls,
      }),
    });
    return response.ok ? 'ok' : 'failed';
  } catch {
    return 'failed';
  }
}
