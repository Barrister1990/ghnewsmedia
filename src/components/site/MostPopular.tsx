import { NewsArticle } from '@/types/news';
import Link from 'next/link';
import { storyHref } from './StoryCard';

const MostPopular = ({ articles, className = '' }: { articles: NewsArticle[]; className?: string }) => {
  if (articles.length === 0) return null;

  return (
    <section aria-labelledby="most-popular-heading" className={className}>
      <h2 id="most-popular-heading" className="mb-2 border-b-2 border-gp-ink pb-1.5 text-xl font-bold text-gp-ink">
        Most popular
      </h2>
      <ol>
        {articles.map((article, index) => (
          <li key={article.id} className="border-b border-gp-line last:border-b-0">
            <Link href={storyHref(article)} className="gp-headline-link flex items-start gap-3 py-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gp-ink text-sm font-bold text-white">
                {index + 1}
              </span>
              <span className="gp-headline text-[0.95rem] font-bold leading-snug text-gp-ink">{article.title}</span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
};

export default MostPopular;
