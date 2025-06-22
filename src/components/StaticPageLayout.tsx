import { NextSeo } from 'next-seo';
import React from 'react';

interface StaticPageLayoutProps {
  title: string;
  children: React.ReactNode;
  description?: string;
  canonical?: string;
}

const StaticPageLayout: React.FC<StaticPageLayoutProps> = ({ 
  title, 
  children, 
  description,
  canonical 
}) => {
  return (
    <>
      <NextSeo
        title={`${title} | GhNewsMedia`}
        description={description}
        canonical={canonical}
        openGraph={{
          title: `${title} | GhNewsMedia`,
          description: description,
          url: canonical,
          siteName: 'GhNewsMedia',
          type: 'website',
        }}
        twitter={{
          cardType: 'summary_large_image',
        }}
      />
      <div className="bg-news-gray-50">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <article className="bg-white p-6 md:p-10 rounded-lg shadow-md max-w-4xl mx-auto">
            <header className="mb-8 border-b pb-6">
              <h1 className="text-3xl md:text-5xl font-bold text-news-blue font-headline text-center">
                {title}
              </h1>
            </header>
            <div className="prose prose-lg max-w-none text-gray-700">
              {children}
            </div>
          </article>
        </div>
      </div>
    </>
  );
};

export default StaticPageLayout;