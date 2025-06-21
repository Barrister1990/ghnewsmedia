
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface StaticPageLayoutProps {
  title: string;
  children: React.ReactNode;
}

const StaticPageLayout: React.FC<StaticPageLayoutProps> = ({ title, children }) => {
  return (
    <>
      <Helmet>
        <title>{`${title} | GhNewsMedia`}</title>
      </Helmet>
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
