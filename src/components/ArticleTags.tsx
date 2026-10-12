import Link from 'next/link';
import React from 'react';

interface ArticleTagsProps {
  tags: string[];
}

const ArticleTags: React.FC<ArticleTagsProps> = ({ tags }) => (
  <nav aria-label="Topics" className="flex flex-wrap items-center gap-2">
    <span className="mr-1 text-xs font-bold uppercase tracking-wider text-gp-muted">Topics</span>
    {tags.map((tag) => (
      <Link
        key={tag}
        href={`/search?q=${encodeURIComponent(tag)}`}
        className="rounded-full border border-gp-line px-3 py-1.5 text-sm font-medium text-gp-ink transition-colors hover:border-gp-ink"
      >
        {tag}
      </Link>
    ))}
  </nav>
);

export default ArticleTags;
