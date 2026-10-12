import AdSlot from '@/components/site/AdSlot';
import { AD_SLOTS } from '@/config/adsense';
import { prepareArticleHtml } from '@/lib/articleHtml';
import { NewsArticle } from '@/types/news';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useRef, useState } from 'react';

declare global {
  interface Window {
    twttr?: { widgets: { load: () => void } };
    instgrm?: { Embeds: { process: () => void } };
  }
}

interface ArticleContentProps {
  content: string;
  featuredImage?: string;
  featuredImageAlt?: string;
  featuredImageCredit?: string;
  inlineImageCredits?: Record<string, string>;
  relatedArticles?: NewsArticle[];
}

const loadScriptOnce = (id: string, src: string, onReady: () => void) => {
  const existing = document.getElementById(id) as HTMLScriptElement | null;
  if (existing) {
    if (existing.dataset.loaded) onReady();
    else existing.addEventListener('load', onReady, { once: true });
    return;
  }
  const script = document.createElement('script');
  script.id = id;
  script.src = src;
  script.async = true;
  script.addEventListener(
    'load',
    () => {
      script.dataset.loaded = '1';
      onReady();
    },
    { once: true }
  );
  document.body.appendChild(script);
};

const ArticleContent: React.FC<ArticleContentProps> = ({
  content,
  featuredImage,
  featuredImageAlt,
  featuredImageCredit,
  inlineImageCredits,
  relatedArticles = [],
}) => {
  const router = useRouter();
  const bodyRef = useRef<HTMLDivElement>(null);
  const [featuredFailed, setFeaturedFailed] = useState(false);

  const prepared = useMemo(
    () =>
      prepareArticleHtml(content, {
        inlineImageCredits,
        adAfterParagraph: 2,
        readMore: relatedArticles.slice(0, 2).map((a) => ({
          href: `/${a.category.slug}/${a.slug}`,
          title: a.title,
        })),
      }),
    [content, inlineImageCredits, relatedArticles]
  );

  // Social embeds: fetch the vendor script only when an embed approaches the viewport.
  useEffect(() => {
    const root = bodyRef.current;
    if (!root || (!prepared.hasTwitter && !prepared.hasInstagram)) return;

    const targets = root.querySelectorAll('.gp-social');
    if (!targets.length) return;

    const hydrateEmbeds = () => {
      if (prepared.hasTwitter) {
        loadScriptOnce('twitter-wjs', 'https://platform.twitter.com/widgets.js', () => window.twttr?.widgets.load());
      }
      if (prepared.hasInstagram) {
        loadScriptOnce('instagram-embed', 'https://www.instagram.com/embed.js', () => window.instgrm?.Embeds.process());
      }
    };

    if (!('IntersectionObserver' in window)) {
      hydrateEmbeds();
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer.disconnect();
          hydrateEmbeds();
        }
      },
      { rootMargin: '800px 0px' }
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [prepared]);

  // YouTube facades become real players on tap; internal links navigate client-side.
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;

    const yt = target.closest<HTMLButtonElement>('button.gp-yt');
    if (yt?.dataset.yt) {
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${yt.dataset.yt}?autoplay=1&rel=0`;
      iframe.title = yt.getAttribute('aria-label') || 'YouTube video';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      yt.replaceWith(iframe);
      return;
    }

    const link = target.closest<HTMLAnchorElement>('a[href^="/"]');
    if (
      link &&
      !link.target &&
      event.button === 0 &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.shiftKey &&
      !event.altKey
    ) {
      event.preventDefault();
      router.push(link.getAttribute('href')!);
    }
  };

  return (
    <div>
      {featuredImage && !featuredFailed && (
        <figure className="-mx-4 mb-7 sm:mx-0">
          <div className="relative aspect-video w-full overflow-hidden bg-gp-surface">
            <Image
              src={featuredImage}
              alt={featuredImageAlt || ''}
              fill
              preload
              fetchPriority="high"
              sizes="(min-width: 1280px) 820px, (min-width: 1024px) 66vw, 100vw"
              className="object-cover"
              onError={() => setFeaturedFailed(true)}
            />
          </div>
          {featuredImageCredit && (
            <figcaption className="px-4 pt-2 text-xs text-gp-muted sm:px-0">{featuredImageCredit}</figcaption>
          )}
        </figure>
      )}

      <div ref={bodyRef} className="gp-prose" onClick={handleClick}>
        {prepared.parts.map((html, i) => (
          <React.Fragment key={i}>
            {i > 0 && <AdSlot slot={AD_SLOTS.IN_ARTICLE_1} shape="infeed" className="my-8" />}
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ArticleContent;
