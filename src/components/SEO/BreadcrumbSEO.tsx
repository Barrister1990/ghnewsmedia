import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { BreadcrumbJsonLd } from 'next-seo';
import React from 'react';

interface BreadcrumbItem {
  name: string;
  url?: string;
}

interface BreadcrumbSEOProps {
  items: BreadcrumbItem[];
}

const BreadcrumbSEO: React.FC<BreadcrumbSEOProps> = ({ items }) => {
  // Transform items for next-seo BreadcrumbJsonLd
  const breadcrumbItems = items.map((item, index) => ({
    position: index + 1,
    name: item.name,
    item: item.url || undefined,
  }));

  return (
    <>
      <BreadcrumbJsonLd itemListElements={breadcrumbItems} />
      
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          {items.map((item, index) => (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {item.url && index < items.length - 1 ? (
                  <BreadcrumbLink href={item.url}>
                    {item.name}
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.name}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {index < items.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
};

export default BreadcrumbSEO;