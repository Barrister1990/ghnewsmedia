import { cn } from '@/lib/utils';
import { ArrowUpRight, PenLine } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export type Tone = 'mint' | 'lemon' | 'lilac' | 'peach' | 'sky' | 'rose';

const TONES: Record<Tone, { bg: string; fg: string }> = {
  mint: { bg: 'bg-dash-mint', fg: 'text-dash-teal-deep' },
  lemon: { bg: 'bg-dash-lemon', fg: 'text-[#8a6100]' },
  lilac: { bg: 'bg-dash-lilac', fg: 'text-[#5b45c4]' },
  peach: { bg: 'bg-dash-peach', fg: 'text-[#c2410c]' },
  sky: { bg: 'bg-dash-sky', fg: 'text-[#1d63b8]' },
  rose: { bg: 'bg-dash-rose', fg: 'text-[#be185d]' },
};

export const greeting = (date = new Date()) => {
  const h = date.getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
};

export const firstName = (meta: Record<string, unknown> | undefined, email?: string | null) => {
  const name = typeof meta?.name === 'string' ? meta.name : typeof meta?.full_name === 'string' ? meta.full_name : '';
  if (name.trim()) return name.trim().split(/\s+/)[0];
  const local = email?.split('@')[0] ?? '';
  const word = local.split(/[._-]/)[0];
  return word ? word.charAt(0).toUpperCase() + word.slice(1) : 'there';
};

export const timeAgo = (iso?: string | null) => {
  if (!iso) return '';
  const diff = Math.max(0, Date.now() - new Date(iso).getTime());
  const m = Math.round(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

const numberFormat = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });
export const compact = (n: number) => numberFormat.format(n);

export function StatTile({
  label,
  value,
  hint,
  icon: Icon,
  tone,
  href,
}: {
  label: string;
  value: number | null;
  hint?: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: Tone;
  href?: string;
}) {
  const t = TONES[tone];
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span className={cn('text-xs font-bold uppercase tracking-wider', t.fg)}>{label}</span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80">
          <Icon className={cn('h-4 w-4', t.fg)} />
        </span>
      </div>
      {value === null ? (
        <div className="gp-dash-skeleton mt-5 h-9 w-20 rounded-lg" />
      ) : (
        <p className="mt-5 text-4xl font-black tabular-nums leading-none text-dash-ink">{compact(value)}</p>
      )}
      {hint ? <p className="mt-2 text-xs font-medium text-dash-ink/60">{hint}</p> : null}
    </>
  );
  const cls = cn('block rounded-3xl p-5 transition-transform', t.bg, href && 'hover:-translate-y-0.5');
  return href ? (
    <Link href={href} className={cls}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}

const STATUS: Record<string, string> = {
  published: 'bg-dash-mint text-dash-teal-deep',
  draft: 'bg-dash-lemon text-[#8a6100]',
  archived: 'bg-dash-mist text-dash-muted',
};

export function StatusPill({ status }: { status?: string | null }) {
  const s = status ?? 'draft';
  return (
    <span className={cn('inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold capitalize', STATUS[s] ?? STATUS.draft)}>
      {s}
    </span>
  );
}

export type DashArticle = {
  id: string | null;
  title: string | null;
  slug: string | null;
  status: string | null;
  featured_image: string | null;
  category_name?: string | null;
  author_name?: string | null;
  updated_at: string | null;
  views?: number | null;
};

export function ArticleRow({ article, editHref }: { article: DashArticle; editHref: string }) {
  return (
    <li className="group flex items-center gap-4 py-3">
      <div className="h-12 w-[72px] shrink-0 overflow-hidden rounded-xl bg-dash-mist">
        {article.featured_image ? (
          <img src={article.featured_image} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
        ) : null}
      </div>
      <div className="min-w-0 flex-1">
        <Link href={editHref} className="line-clamp-1 text-[15px] font-bold text-dash-ink hover:underline">
          {article.title || 'Untitled'}
        </Link>
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-dash-muted">
          <StatusPill status={article.status} />
          {article.category_name ? <span>{article.category_name}</span> : null}
          {article.author_name ? <span>· {article.author_name}</span> : null}
          <span>· {timeAgo(article.updated_at)}</span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {article.status === 'published' && article.slug ? (
          <Link
            href={`/news/${article.slug}`}
            target="_blank"
            className="hidden h-9 w-9 items-center justify-center rounded-full text-dash-muted hover:bg-dash-mist hover:text-dash-ink sm:flex"
            aria-label="View live article"
          >
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        ) : null}
        <Link
          href={editHref}
          className="flex h-9 w-9 items-center justify-center rounded-full text-dash-muted hover:bg-dash-mist hover:text-dash-ink"
          aria-label="Edit article"
        >
          <PenLine className="h-4 w-4" />
        </Link>
      </div>
    </li>
  );
}

export function ArticleListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <ul className="divide-y divide-dash-line">
      {Array.from({ length: rows }).map((_, i) => (
        <li key={i} className="flex items-center gap-4 py-3">
          <div className="gp-dash-skeleton h-12 w-[72px] rounded-xl" />
          <div className="flex-1 space-y-2">
            <div className="gp-dash-skeleton h-4 w-3/4 rounded-md" />
            <div className="gp-dash-skeleton h-3 w-1/3 rounded-md" />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function SectionCard({
  title,
  action,
  children,
  className,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn('rounded-3xl border border-dash-line bg-white p-5 sm:p-6', className)}>
      <div className="mb-2 flex items-center justify-between gap-3">
        <h2 className="text-xl font-black">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export const pillLink =
  'inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-bold transition-colors';
export const pillPrimary = `${pillLink} bg-dash-teal-dark text-white hover:bg-dash-teal-deep`;
export const pillOutline = `${pillLink} border border-dash-ink text-dash-ink hover:bg-dash-ink hover:text-white`;
