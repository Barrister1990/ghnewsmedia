import { cn } from '@/lib/utils';
import React from 'react';

/** Shared panel surface for cards / bordered sections (admin & CMS shells). */
export const PANEL_CARD = 'rounded-2xl border border-dash-line bg-white';

interface PanelPageHeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
  actions?: React.ReactNode;
  className?: string;
}

/** Page-level title row: stacks on mobile; title + optional actions on larger screens. */
export function PanelPageHeader({ title, description, eyebrow, actions, className }: PanelPageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-5 pb-2 sm:flex-row sm:items-end sm:justify-between sm:gap-8',
        className
      )}
    >
      <div className="min-w-0">
        {eyebrow ? (
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-dash-teal-dark">{eyebrow}</p>
        ) : null}
        <h1 className="text-3xl font-black leading-[1.05] text-dash-ink sm:text-[2.6rem]">{title}</h1>
        {description ? (
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-dash-muted">{description}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          {actions}
        </div>
      ) : null}
    </div>
  );
}
