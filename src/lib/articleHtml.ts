import { isSiteUrl } from '@/config/site';

export interface ReadMoreLink {
  href: string;
  title: string;
}

export interface PreparedArticleHtml {
  /** Body split at the in-article ad position (one entry when no ad break). */
  parts: string[];
  hasTwitter: boolean;
  hasInstagram: boolean;
}

const SITE_ORIGIN = /^https?:\/\/(?:www\.)?(?:ghnewsmedia\.com|ghanapoint\.com)/i;
const CONTAINER_TAGS = new Set(['blockquote', 'ul', 'ol', 'table', 'li', 'figure']);
const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const textOf = (html: string) => html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();

const attr = (attrs: string, name: string) => {
  const m = attrs.match(new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, 'i'));
  return m ? (m[2] ?? m[3] ?? '') : '';
};

const toLocalPath = (href: string) => {
  if (!isSiteUrl(href)) return href;
  return href.replace(SITE_ORIGIN, '') || '/';
};

const BLOCK_START = /^<\/?(p|h[1-6]|ul|ol|li|blockquote|div|figure|figcaption|table|thead|tbody|tr|iframe|img|hr|pre|section|article)\b/i;

/**
 * Wraps plain-text / markdown blocks (separated by blank lines) in proper HTML.
 * Blocks that already start with a block-level tag pass through untouched, so Tiptap HTML is unaffected.
 */
function normalizeBlocks(text: string): string {
  return text
    .replace(/\r\n?/g, '\n')
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      if (BLOCK_START.test(block)) return block;
      const inline = (s: string) =>
        s
          .replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, '<img src="$2" alt="$1">')
          .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')
          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.+?)\*/g, '<em>$1</em>')
          .replace(/\n/g, '<br>');
      const heading = block.match(/^(#{1,3})\s+(.*)$/);
      if (heading) {
        const level = Math.max(2, heading[1].length);
        return `<h${level}>${inline(heading[2])}</h${level}>`;
      }
      if (/^>\s?/.test(block)) return `<blockquote><p>${inline(block.replace(/^>\s?/gm, ''))}</p></blockquote>`;
      if (/^[-*]\s+/.test(block)) {
        const items = block.split(/\n/).map((l) => `<li>${inline(l.replace(/^[-*]\s+/, ''))}</li>`);
        return `<ul>${items.join('')}</ul>`;
      }
      return `<p>${inline(block)}</p>`;
    })
    .join('');
}

/** Drop editor/pasted classes and inline styles so the reading stylesheet is the single source of truth. */
function cleanAttributes(html: string): string {
  return html.replace(/<([a-zA-Z][a-zA-Z0-9]*)(\s[^>]*?)?(\/?)>/g, (full, tag: string, attrs = '', selfClose) => {
    const name = tag.toLowerCase();
    if (!attrs) return full;
    let next = attrs;

    const cls = attr(attrs, 'class');
    const keepClass = name === 'blockquote' && /(twitter-tweet|instagram-media)/.test(cls);
    next = next.replace(/\sclass\s*=\s*("[^"]*"|'[^']*')/gi, '');
    if (keepClass) next += ` class="${cls}"`;

    const style = attr(attrs, 'style');
    next = next.replace(/\sstyle\s*=\s*("[^"]*"|'[^']*')/gi, '');
    const align = style.match(/text-align\s*:\s*(center|right|justify)/i);
    if (align && /^(p|h[1-6]|div)$/.test(name)) next += ` style="text-align:${align[1].toLowerCase()}"`;

    return `<${tag}${next}${selfClose}>`;
  });
}

function youtubeId(src: string): string | null {
  const m =
    src.match(/youtube(?:-nocookie)?\.com\/embed\/([\w-]{6,})/) ||
    src.match(/youtu\.be\/([\w-]{6,})/) ||
    src.match(/youtube\.com\/watch\?v=([\w-]{6,})/);
  return m ? m[1] : null;
}

function transformEmbeds(html: string): string {
  return html.replace(/<iframe\b([^>]*)>(?:[\s\S]*?<\/iframe>)?/gi, (_m, attrs: string) => {
    const src = attr(attrs, 'src');
    if (!src) return '';
    const title = attr(attrs, 'title') || 'Embedded content';
    const yt = youtubeId(src);
    if (yt) {
      return (
        `<span class="gp-embed gp-embed-video">` +
        `<button type="button" class="gp-yt" data-yt="${yt}" aria-label="Play video: ${escapeHtml(title)}">` +
        `<img src="https://i.ytimg.com/vi/${yt}/hqdefault.jpg" alt="" loading="lazy" decoding="async">` +
        `<span class="gp-yt-play" aria-hidden="true"></span></button></span>`
      );
    }
    const kind = /facebook\.com/.test(src)
      ? 'gp-embed-fb'
      : /instagram\.com/.test(src)
        ? 'gp-embed-ig'
        : /(twitter|x)\.com/.test(src)
          ? 'gp-embed-tw'
          : 'gp-embed-video';
    return (
      `<span class="gp-embed ${kind}"><iframe src="${escapeHtml(src)}" title="${escapeHtml(title)}" ` +
      `loading="lazy" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowfullscreen></iframe></span>`
    );
  });
}

function transformBlockquotes(html: string, flags: { tw: boolean; ig: boolean }): string {
  return html.replace(/<blockquote\b([^>]*)>([\s\S]*?)<\/blockquote>/gi, (full, attrs: string, inner: string) => {
    const cls = attr(attrs, 'class');
    const isTweet = cls.includes('twitter-tweet') || /(twitter|x)\.com\/[^"'\s<>]+\/status\/\d+/.test(inner);
    if (isTweet) {
      flags.tw = true;
      return `<div class="gp-social gp-social-tw"><blockquote class="twitter-tweet" data-dnt="true">${inner}</blockquote></div>`;
    }
    const igUrl = inner.match(/https?:\/\/(?:www\.)?instagram\.com\/(?:reel|p|tv)\/[^"'\s<>?]+/);
    if (cls.includes('instagram-media') || igUrl) {
      flags.ig = true;
      const permalink = attr(attrs, 'data-instgrm-permalink') || igUrl?.[0] || '';
      return (
        `<div class="gp-social gp-social-ig"><blockquote class="instagram-media" data-instgrm-version="14"` +
        `${permalink ? ` data-instgrm-permalink="${escapeHtml(permalink)}"` : ''}>${inner}</blockquote></div>`
      );
    }
    return full;
  });
}

function transformImages(html: string, credits: Record<string, string>): string {
  return html.replace(/<img\b([^>]*?)\/?>/gi, (_m, attrs: string) => {
    const src = attr(attrs, 'src');
    if (!src) return '';
    const alt = attr(attrs, 'alt');
    const credit = attr(attrs, 'data-credit') || credits[src] || '';
    const width = attr(attrs, 'width');
    const height = attr(attrs, 'height');
    const size = width && height ? ` width="${width}" height="${height}"` : '';
    const img = `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}"${size} loading="lazy" decoding="async">`;
    return `<span class="gp-figure">${img}${credit ? `<span class="gp-credit">${escapeHtml(credit)}</span>` : ''}</span>`;
  });
}

function transformLinks(html: string): string {
  return html.replace(/<a\b([^>]*)>/gi, (_m, attrs: string) => {
    const raw = attr(attrs, 'href');
    if (!raw) return '<a>';
    const href = toLocalPath(raw.trim());
    const external = /^https?:\/\//i.test(href);
    return external
      ? `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">`
      : `<a href="${escapeHtml(href)}">`;
  });
}

/** Turns editor "READ MORE: <link>" paragraphs into the house related-link style. */
function transformReadMore(html: string): string {
  return html.replace(/<p>([\s\S]*?)<\/p>/gi, (full, inner: string) => {
    if (!/read\s*more/i.test(textOf(inner))) return full;
    const link = inner.match(/<a href="(\/[^"]*)"[^>]*>([\s\S]*?)<\/a>/i);
    if (!link) return full;
    const title = textOf(link[2]).replace(/^read\s*more\s*:?\s*/i, '') || textOf(inner).replace(/^read\s*more\s*:?\s*/i, '');
    return readMoreHtml({ href: link[1], title });
  });
}

const readMoreHtml = ({ href, title }: ReadMoreLink) =>
  `<p class="gp-readmore"><a href="${escapeHtml(href)}"><span>Read more</span>${escapeHtml(title)}</a></p>`;

/** Byte offsets just after each top-level `</p>` (not inside lists, quotes or tables). */
function topLevelParagraphEnds(html: string): number[] {
  const ends: number[] = [];
  let depth = 0;
  const re = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const closing = m[1] === '/';
    const tag = m[2].toLowerCase();
    if (CONTAINER_TAGS.has(tag)) depth = Math.max(0, depth + (closing ? -1 : 1));
    else if (closing && tag === 'p' && depth === 0) ends.push(m.index + m[0].length);
  }
  return ends;
}

export function prepareArticleHtml(
  content: string,
  options: { readMore?: ReadMoreLink[]; inlineImageCredits?: Record<string, string>; adAfterParagraph?: number } = {}
): PreparedArticleHtml {
  const { readMore = [], inlineImageCredits = {}, adAfterParagraph = 0 } = options;
  const flags = { tw: false, ig: false };

  let html = content
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(div|p)\b[^>]*>\s*Embedded content from:[^<]*<\/\1>/gi, '')
    .replace(/<p>(?:\s|&nbsp;|<br\s*\/?>)*<\/p>/gi, '');

  html = normalizeBlocks(html);
  html = cleanAttributes(html);
  html = transformBlockquotes(html, flags);
  html = transformImages(html, inlineImageCredits);
  html = transformEmbeds(html);
  html = transformLinks(html);
  html = transformReadMore(html);

  const ends = topLevelParagraphEnds(html);

  const adAt = adAfterParagraph > 0 && ends.length > adAfterParagraph ? ends[adAfterParagraph - 1] : -1;

  const inserts: { at: number; html: string }[] = [];
  if (readMore.length && ends.length >= 3) {
    const points = [Math.floor(ends.length / 3), Math.floor((ends.length * 2) / 3)]
      .map((p) => (adAt >= 0 && p === adAfterParagraph ? p + 1 : p))
      .filter((p, i, arr) => p > 0 && p < ends.length && arr.indexOf(p) === i)
      .slice(0, readMore.length);
    points.forEach((p, i) => inserts.push({ at: ends[p - 1], html: readMoreHtml(readMore[i]) }));
  }

  let out = '';
  let cursor = 0;
  const parts: string[] = [];
  const points = [...new Set([...inserts.map((i) => i.at), adAt])].filter((n) => n >= 0).sort((a, b) => a - b);
  for (const point of points) {
    out += html.slice(cursor, point);
    cursor = point;
    if (point === adAt) {
      parts.push(out);
      out = '';
    }
    for (const ins of inserts.filter((i) => i.at === point)) out += ins.html;
  }
  out += html.slice(cursor);
  parts.push(out);

  return { parts: parts.filter((p, i) => p.trim() || i === 0), hasTwitter: flags.tw, hasInstagram: flags.ig };
}
