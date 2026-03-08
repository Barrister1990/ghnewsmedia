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
};

type ResponseData = {
  success: boolean;
  googleIndexing?: boolean;
  error?: string;
};

function buildUrl(body: Payload): string | null {
  if (body.url && typeof body.url === 'string') {
    return body.url.startsWith('http') ? body.url : `${BASE_URL}${body.url.startsWith('/') ? '' : '/'}${body.url}`;
  }
  if (body.category && body.slug && typeof body.category === 'string' && typeof body.slug === 'string') {
    return `${BASE_URL}/${body.category}/${body.slug}`;
  }
  return null;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const url = buildUrl(req.body as Payload);
  if (!url || !url.startsWith(BASE_URL)) {
    return res.status(400).json({ success: false, error: 'Missing or invalid url, or category+slug' });
  }

  try {
    const googleIndexingService = GoogleIndexingService.getInstance();
    const googleSuccess = await googleIndexingService.notifyGoogleOfUrl(url);

    await seoService.notifySearchEngines(`${BASE_URL}/sitemap.xml`);

    return res.status(200).json({
      success: true,
      googleIndexing: googleSuccess,
    });
  } catch (error) {
    console.error('notify-indexing API error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Notification failed',
    });
  }
}
