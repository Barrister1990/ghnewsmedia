// API route: called by the admin after an article is published, updated or unpublished.
// Refreshes cached pages, then tells the WebSub hub (and IndexNow, if configured) that the feed changed.
// Google discovers news through sitemaps, RSS/WebSub and crawling. Its Indexing API is restricted to
// JobPosting/livestream pages, and the sitemap "ping" endpoints were retired in 2023, so neither is used.
import type { NextApiRequest, NextApiResponse } from 'next';
import { SITE_URL } from '@/config/site';
import { supabase } from '@/integrations/supabase/client';
import { publishToWebSub, submitToIndexNow } from '@/lib/websub';

type Source = 'publish_event' | 'update_event' | 'status_change';

type Payload = {
  url?: string;
  category?: string;
  slug?: string;
  articleId?: string;
  source?: Source;
};

type ResponseData = {
  success: boolean;
  url?: string;
  websub?: boolean;
  indexNow?: 'ok' | 'failed' | 'skipped';
  deduped?: boolean;
  timestamp?: string;
  error?: string;
};

const DEDUPE_WINDOW_MS = 60 * 1000;
const recentRequests = new Map<string, number>();

async function resolveUrl(body: Payload): Promise<string | null> {
  if (body.url && typeof body.url === 'string') {
    return body.url.startsWith('http') ? body.url : `${SITE_URL}${body.url.startsWith('/') ? '' : '/'}${body.url}`;
  }
  if (typeof body.category === 'string' && typeof body.slug === 'string' && body.category && body.slug) {
    return `${SITE_URL}/${body.category}/${body.slug}`;
  }
  if (typeof body.articleId === 'string' && body.articleId) {
    const { data } = await supabase
      .from('articles_with_details')
      .select('slug, category_slug')
      .eq('id', body.articleId)
      .maybeSingle();
    const row = data as { slug?: string | null; category_slug?: string | null } | null;
    if (row?.slug && row.category_slug) return `${SITE_URL}/${row.category_slug}/${row.slug}`;
  }
  return null;
}

/** Regenerate cached (ISR) pages so changes are live before crawlers are told about them. */
async function revalidatePages(res: NextApiResponse, paths: string[]) {
  await Promise.all(
    paths.map(async (path) => {
      try {
        await res.revalidate(path);
      } catch (error) {
        console.error(`Failed to revalidate ${path}:`, error);
      }
    })
  );
}

function isAuthorizedRequest(req: NextApiRequest): boolean {
  const configuredKey = process.env.INDEXING_NOTIFY_API_KEY;
  if (configuredKey && req.headers['x-indexing-key'] === configuredKey) {
    return true;
  }

  const origin = req.headers.origin;
  const referer = req.headers.referer;
  if (typeof origin === 'string') {
    return origin === SITE_URL;
  }
  if (typeof referer === 'string') {
    return referer.startsWith(SITE_URL);
  }
  return false;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  if (!isAuthorizedRequest(req)) {
    return res.status(401).json({ success: false, error: 'Unauthorized indexing notification request' });
  }

  const body = (req.body || {}) as Payload;
  const url = await resolveUrl(body);
  if (!url || !url.startsWith(SITE_URL)) {
    return res.status(400).json({ success: false, error: 'Missing or invalid url, category+slug, or articleId' });
  }

  const source: Source = body.source || 'update_event';
  const dedupeKey = `${source}:${url}`;
  const now = Date.now();
  const lastRequestAt = recentRequests.get(dedupeKey);
  if (lastRequestAt && now - lastRequestAt < DEDUPE_WINDOW_MS) {
    return res.status(200).json({ success: true, url, deduped: true, timestamp: new Date().toISOString() });
  }
  recentRequests.set(dedupeKey, now);

  try {
    await revalidatePages(res, [new URL(url).pathname, '/', '/authors']);

    const [websub, indexNow] = await Promise.all([publishToWebSub(), submitToIndexNow([url])]);
    console.log('[IndexingNotify]', JSON.stringify({ url, source, websub, indexNow }));

    return res.status(200).json({
      success: true,
      url,
      websub,
      indexNow,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('notify-indexing API error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Notification failed',
    });
  }
}
