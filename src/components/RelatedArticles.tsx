
import React from 'react';
import { NewsArticle } from '../types/news';
import NewsCard from './NewsCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel';

interface RelatedArticlesProps {
  articles: NewsArticle[];
}

const RelatedArticles: React.FC<RelatedArticlesProps> = ({ articles }) => {
  if (articles.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Related Articles</h2>
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 sm:-ml-3 lg:-ml-4">
          {articles.map((article) => (
            <CarouselItem key={article.id} className="pl-2 sm:pl-3 lg:pl-4 basis-[260px] sm:basis-[280px] lg:basis-[320px]">
              <NewsCard article={article} variant="compact" />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0 hidden sm:flex" />
        <CarouselNext className="right-0 hidden sm:flex" />
      </Carousel>
    </section>
  );
};

export default RelatedArticles;
