// API route: notify Google (Indexing API + sitemap ping) and other search engines. Runs on server only (credentials in env).
import type { NextApiRequest, NextApiResponse } from 'next';
import GoogleIndexingService from '@/services/googleIndexingService';
import SEOService from '@/services/seoService';

const seoService = SEOService.getInstance();

const BASE_URL = 'https://ghnewsmedia.com';

type Payload = {
  url?: string;
  category?: string;
  slug?: string;
  publishedAt?: string;
  source?: 'publish_event' | 'update_event' | 'view_fallback';
};

type ResponseData = {
  success: boolean;
  googleIndexing?: boolean;
  indexingApiStatus?: 'ok' | 'failed' | 'skipped_no_credentials';
  source?: string;
  deduped?: boolean;
  timestamp?: string;
  notifyLatencyMs?: number;
  recentLogs?: unknown[];
  error?: string;
};

const DEDUPE_WINDOW_MS = 60 * 1000;
const recentRequests = new Map<string, number>();

function buildUrl(body: Payload): string | null {
  if (body.url && typeof body.url === 'string') {
    return body.url.startsWith('http') ? body.url : `${BASE_URL}${body.url.startsWith('/') ? '' : '/'}${body.url}`;
  }
  if (body.category && body.slug && typeof body.category === 'string' && typeof body.slug === 'string') {
    return `${BASE_URL}/${body.category}/${body.slug}`;
  }
  return null;
}

function isAuthorizedRequest(req: NextApiRequest): boolean {
  const configuredKey = process.env.INDEXING_NOTIFY_API_KEY;
  if (configuredKey) {
    return req.headers['x-indexing-key'] === configuredKey;
  }

  const origin = req.headers.origin;
  const referer = req.headers.referer;
  const allowedHost = 'https://ghnewsmedia.com';

  if (typeof origin === 'string') {
    return origin === allowedHost;
  }
  if (typeof referer === 'string') {
    return referer.startsWith(allowedHost);
  }
  return false;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === 'GET') {
    if (!isAuthorizedRequest(req)) {
      return res.status(401).json({ success: false, error: 'Unauthorized indexing report request' });
    }
    const googleIndexingService = GoogleIndexingService.getInstance();
    const recentLogs = googleIndexingService.getRecentSubmissionLogs(20);
    return res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      recentLogs,
    });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  if (!isAuthorizedRequest(req)) {
    return res.status(401).json({ success: false, error: 'Unauthorized indexing notification request' });
  }

  const url = buildUrl(req.body as Payload);
  if (!url || !url.startsWith(BASE_URL)) {
    return res.status(400).json({ success: false, error: 'Missing or invalid url, or category+slug' });
  }

  try {
    const source = (req.body as Payload).source || 'view_fallback';
    const dedupeKey = `${source}:${url}`;
    const now = Date.now();
    const lastRequestAt = recentRequests.get(dedupeKey);
    if (lastRequestAt && now - lastRequestAt < DEDUPE_WINDOW_MS) {
      return res.status(200).json({
        success: true,
        googleIndexing: false,
        indexingApiStatus: 'skipped_no_credentials',
        source,
        deduped: true,
        timestamp: new Date().toISOString(),
      });
    }
    recentRequests.set(dedupeKey, now);

    const googleIndexingService = GoogleIndexingService.getInstance();
    const publishedAtRaw = (req.body as Payload).publishedAt;
    const publishDate = publishedAtRaw ? new Date(publishedAtRaw) : null;
    const publishToNotifyMs =
      publishDate && !Number.isNaN(publishDate.getTime())
        ? Date.now() - publishDate.getTime()
        : undefined;

    const googleResult = await googleIndexingService.notifyGoogleOfUrlDetailed(url, source);
    googleResult.notifyLatencyMs = publishToNotifyMs;

    await seoService.notifySearchEngines(`${BASE_URL}/sitemap.xml`);

    return res.status(200).json({
      success: googleResult.success,
      googleIndexing: googleResult.indexingApiSubmitted,
      indexingApiStatus: googleResult.indexingApiStatus,
      source: googleResult.source,
      deduped: false,
      timestamp: googleResult.timestamp,
      notifyLatencyMs: googleResult.notifyLatencyMs,
    });
  } catch (error) {
    console.error('notify-indexing API error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Notification failed',
    });
  }
}
