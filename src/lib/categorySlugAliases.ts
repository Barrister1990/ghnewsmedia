/**
 * URL segments in the header/footer may not match `categories.slug` in Supabase.
 * Try the path slug first, then these fallbacks when loading `_category/[slug]`.
 */
export function categorySlugCandidates(urlSlug: string): string[] {
  const key = urlSlug.toLowerCase().trim();
  const fallbacks: Record<string, string[]> = {
    lifestyle: ['entertainment'],
    tech: ['technology'],
    feature: ['features', 'feature'],
    opinions: ['opinion'],
  };
  const chain = [key, ...(fallbacks[key] ?? [])];
  return [...new Set(chain)];
}

/** Prefer editorial labels that match nav copy when the DB category name differs. */
export function categorySectionHeading(urlSlug: string, dbCategoryName: string): string {
  const labels: Record<string, string> = {
    lifestyle: 'Lifestyle',
    tech: 'Tech',
    feature: 'Feature',
    opinions: 'Opinions',
    news: 'News',
  };
  return labels[urlSlug.toLowerCase()] ?? dbCategoryName;
}
