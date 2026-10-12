import { Check, Facebook, Link2, Mail, MessageCircle, Share2, Twitter } from 'lucide-react';
import React, { useState } from 'react';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  image?: string;
  className?: string;
}

export const shareUrls = (url: string, title: string, description = '') => {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  return {
    whatsapp: `https://wa.me/?text=${t}%20${u}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
    x: `https://twitter.com/intent/tweet?url=${u}&text=${t}&via=GhNewsMedia`,
    email: `mailto:?subject=${t}&body=${encodeURIComponent(description)}%0A%0A${u}`,
  };
};

/** Native share sheet when available, otherwise copies the link. Returns true if the link was copied. */
export const shareOrCopy = async (url: string, title: string, text?: string): Promise<boolean> => {
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return false;
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return false;
    }
  }
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    return false;
  }
};

const btn =
  'flex h-10 w-10 items-center justify-center rounded-full border border-gp-line text-gp-ink transition-colors hover:border-gp-ink hover:bg-gp-ink hover:text-white sm:h-9 sm:w-9';

const ShareButtons: React.FC<ShareButtonsProps> = ({ url, title, description = '', className = '' }) => {
  const [copied, setCopied] = useState(false);
  const links = shareUrls(url, title, description);

  const items = [
    { name: 'WhatsApp', href: links.whatsapp, icon: MessageCircle },
    { name: 'Facebook', href: links.facebook, icon: Facebook },
    { name: 'X', href: links.x, icon: Twitter },
    { name: 'Email', href: links.email, icon: Mail },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  };

  const share = async () => {
    if (await shareOrCopy(url, title, description)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`} role="group" aria-label="Share this story">
      {items.map(({ name, href, icon: Icon }) => (
        <a
          key={name}
          href={href}
          target={name === 'Email' ? undefined : '_blank'}
          rel="noopener noreferrer"
          className={btn}
          aria-label={`Share on ${name}`}
          title={`Share on ${name}`}
        >
          <Icon className="h-4 w-4" aria-hidden />
        </a>
      ))}
      <button type="button" onClick={copy} className={btn} aria-label={copied ? 'Link copied' : 'Copy link'} title="Copy link">
        {copied ? <Check className="h-4 w-4" aria-hidden /> : <Link2 className="h-4 w-4" aria-hidden />}
      </button>
      <button type="button" onClick={share} className={`${btn} sm:hidden`} aria-label="More sharing options">
        <Share2 className="h-4 w-4" aria-hidden />
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? 'Link copied to clipboard' : ''}
      </span>
    </div>
  );
};

export default ShareButtons;
