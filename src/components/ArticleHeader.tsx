import Link from 'next/link';
import React from 'react';
import { NewsArticle } from '../types/news';
import { formatPublishedDateTime } from './site/TimeAgo';
import { UserAvatar } from './UserAvatar';

interface ArticleHeaderProps {
  article: NewsArticle;
}

const ArticleHeader: React.FC<ArticleHeaderProps> = ({ article }) => {
  const published = new Date(article.publishedAt);
  const updated = article.updatedAt ? new Date(article.updatedAt) : null;
  const showUpdated = updated && updated.getTime() - published.getTime() > 60 * 60 * 1000;

  return (
    <header>
      <Link
        href={`/${article.category.slug}`}
        className="mb-3 inline-block text-sm font-bold uppercase tracking-wide text-gp-accent-dark hover:underline"
      >
        {article.category.name}
      </Link>

      <h1 className="text-[1.75rem] font-bold leading-[1.15] tracking-[-0.01em] text-balance text-gp-ink sm:text-[2.4rem] lg:text-[2.75rem]">
        {article.title}
      </h1>

      {article.excerpt && (
        <p className="mt-3 text-[1.0625rem] leading-relaxed text-gp-muted text-pretty sm:mt-4 sm:text-xl">{article.excerpt}</p>
      )}

      <div className="mt-5 flex items-center gap-3 border-y border-gp-line py-3">
        {article.author.avatar && (
          <UserAvatar src={article.author.avatar} alt={article.author.name} className="h-10 w-10 shrink-0" size={40} />
        )}
        <div className="min-w-0 text-sm">
          <p className="font-bold text-gp-ink">
            By{' '}
            {article.author.id ? (
              <Link href={`/author/${article.author.id}`} className="underline-offset-2 hover:underline" rel="author">
                {article.author.name}
              </Link>
            ) : (
              article.author.name
            )}
          </p>
          <p className="flex flex-wrap gap-x-2 text-gp-muted">
            <span>
              Published{' '}
              <time dateTime={published.toISOString()}>{formatPublishedDateTime(article.publishedAt)}</time>
            </span>
            {showUpdated && (
              <span>
                <span aria-hidden>· </span>Updated{' '}
                <time dateTime={updated!.toISOString()}>{formatPublishedDateTime(article.updatedAt)}</time>
              </span>
            )}
            {article.readTime ? (
              <span>
                <span aria-hidden>· </span>
                {article.readTime} min read
              </span>
            ) : null}
          </p>
        </div>
      </div>
    </header>
  );
};

export default ArticleHeader;
