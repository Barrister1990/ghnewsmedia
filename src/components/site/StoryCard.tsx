import { NewsArticle } from '@/types/news';
import Image from 'next/image';
import Link from 'next/link';
import TimeAgo from './TimeAgo';

export type StoryVariant = 'lead' | 'list' | 'card' | 'feed' | 'text' | 'overlay';

interface StoryCardProps {
  article: NewsArticle;
  variant: StoryVariant;
  /** Load the image ahead of everything else (use for the largest image on screen). */
  preload?: boolean;
  showExcerpt?: boolean;
  showDate?: boolean;
  showCategory?: boolean;
  headingLevel?: 'h2' | 'h3';
  className?: string;
}

export const storyHref = (article: NewsArticle) => `/${article.category.slug}/${article.slug}`;

const Thumb = ({ article, sizes, preload, className }: { article: NewsArticle; sizes: string; preload?: boolean; className: string }) => (
  <div className={`relative overflow-hidden bg-gp-surface ${className}`}>
    <Image src={article.featuredImage} alt={article.title} fill sizes={sizes} preload={preload} className="object-cover" />
  </div>
);

const Kicker = ({ article }: { article: NewsArticle }) => (
  <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-gp-accent-dark">{article.category.name}</span>
);

const StoryCard = ({
  article,
  variant,
  preload = false,
  showExcerpt = false,
  showDate = false,
  showCategory = false,
  headingLevel: H = 'h3',
  className = '',
}: StoryCardProps) => {
  const href = storyHref(article);

  if (variant === 'lead') {
    return (
      <article className={className}>
        <Link href={href} className="gp-headline-link block">
          <Thumb article={article} preload={preload} sizes="(max-width: 1024px) 100vw, 60vw" className="aspect-video" />
          <div className="pt-3">
            {showCategory && <Kicker article={article} />}
            <H className="gp-headline text-[1.6rem] font-bold leading-[1.15] text-gp-ink sm:text-[2rem] lg:text-[2.25rem]">
              {article.title}
            </H>
          </div>
        </Link>
        {showExcerpt && article.excerpt && (
          <p className="mt-2 text-base leading-relaxed text-gp-muted sm:text-lg">{article.excerpt}</p>
        )}
        {showDate && <TimeAgo date={article.publishedAt} className="mt-2 block text-xs text-gp-muted" />}
      </article>
    );
  }

  if (variant === 'overlay') {
    return (
      <article className={className}>
        <Link href={href} className="gp-headline-link block">
          <Thumb article={article} preload={preload} sizes="(max-width: 768px) 100vw, 25vw" className="aspect-[4/3]" />
          <H className="gp-headline mt-2 text-base font-bold leading-snug text-white">{article.title}</H>
        </Link>
        {showDate && <TimeAgo date={article.publishedAt} className="mt-1 block text-xs text-white/70" />}
      </article>
    );
  }

  if (variant === 'card') {
    return (
      <article className={className}>
        <Link href={href} className="gp-headline-link block">
          <Thumb article={article} preload={preload} sizes="(max-width: 768px) 100vw, 33vw" className="aspect-video" />
          <div className="pt-2">
            {showCategory && <Kicker article={article} />}
            <H className="gp-headline text-[1.05rem] font-bold leading-snug text-gp-ink">{article.title}</H>
          </div>
        </Link>
        {showExcerpt && article.excerpt && (
          <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-gp-muted">{article.excerpt}</p>
        )}
        {showDate && <TimeAgo date={article.publishedAt} className="mt-1 block text-xs text-gp-muted" />}
      </article>
    );
  }

  if (variant === 'list') {
    return (
      <article className={className}>
        <Link href={href} className="gp-headline-link flex gap-3">
          <div className="min-w-0 flex-1">
            {showCategory && <Kicker article={article} />}
            <H className="gp-headline text-[0.98rem] font-bold leading-snug text-gp-ink">{article.title}</H>
            {showDate && <TimeAgo date={article.publishedAt} className="mt-1 block text-xs text-gp-muted" />}
          </div>
          <Thumb article={article} sizes="128px" className="aspect-video w-28 shrink-0 sm:w-32" />
        </Link>
      </article>
    );
  }

  if (variant === 'feed') {
    return (
      <article className={`border-b border-gp-line py-5 ${className}`}>
        <Link href={href} className="gp-headline-link flex gap-4 sm:gap-6">
          <div className="min-w-0 flex-1">
            {showCategory && <Kicker article={article} />}
            <H className="gp-headline text-[1.05rem] font-bold leading-snug text-gp-ink sm:text-xl">{article.title}</H>
            {article.excerpt && (
              <p className="mt-2 hidden text-[0.95rem] leading-relaxed text-gp-muted sm:line-clamp-2">{article.excerpt}</p>
            )}
            <TimeAgo date={article.publishedAt} className="mt-2 block text-xs text-gp-muted" />
          </div>
          <Thumb article={article} sizes="(max-width: 640px) 128px, 280px" className="aspect-video w-32 shrink-0 sm:w-56 lg:w-72" />
        </Link>
      </article>
    );
  }

  return (
    <article className={className}>
      <Link href={href} className="gp-headline-link block">
        {showCategory && <Kicker article={article} />}
        <H className="gp-headline text-[0.98rem] font-bold leading-snug text-gp-ink">{article.title}</H>
      </Link>
      {showDate && <TimeAgo date={article.publishedAt} className="mt-1 block text-xs text-gp-muted" />}
    </article>
  );
};

export default StoryCard;
