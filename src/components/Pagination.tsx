import Link from 'next/link';
import React from 'react';

export const pageHref = (basePath: string, page: number) =>
  page <= 1 ? basePath : `${basePath}?page=${page}`;

/** Page numbers to show around the current page, with `null` marking a gap. */
const visiblePages = (current: number, total: number): (number | null)[] => {
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  return sorted.flatMap((p, i) => (i > 0 && p - sorted[i - 1] > 1 ? [null, p] : [p]));
};

/**
 * Parses `?page=N`. Returns 1 when absent, or null when the value is not a canonical
 * integer ≥ 2 (callers redirect those to the base URL).
 */
export const parsePageParam = (raw: string | string[] | undefined): number | null => {
  if (raw === undefined) return 1;
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!/^\d+$/.test(value)) return null;
  const page = Number(value);
  return page >= 2 ? page : null;
};

const Pagination: React.FC<{ basePath: string; currentPage: number; totalPages: number }> = ({
  basePath,
  currentPage,
  totalPages,
}) => {
  if (totalPages <= 1) return null;

  const linkClass = 'min-w-9 rounded border border-gray-300 px-3 py-1.5 text-center text-sm text-gray-700 hover:bg-gray-100';
  const currentClass = 'min-w-9 rounded border border-gray-900 bg-gray-900 px-3 py-1.5 text-center text-sm font-semibold text-white';

  return (
    <nav aria-label="Pagination" className="mt-8 flex flex-wrap items-center justify-center gap-2">
      {currentPage > 1 && (
        <Link href={pageHref(basePath, currentPage - 1)} rel="prev" className={linkClass}>
          ← Previous
        </Link>
      )}
      {visiblePages(currentPage, totalPages).map((page, i) =>
        page === null ? (
          <span key={`gap-${i}`} className="px-1 text-gray-500">…</span>
        ) : page === currentPage ? (
          <span key={page} aria-current="page" className={currentClass}>{page}</span>
        ) : (
          <Link key={page} href={pageHref(basePath, page)} className={linkClass}>
            {page}
          </Link>
        )
      )}
      {currentPage < totalPages && (
        <Link href={pageHref(basePath, currentPage + 1)} rel="next" className={linkClass}>
          Next →
        </Link>
      )}
    </nav>
  );
};

export default Pagination;
