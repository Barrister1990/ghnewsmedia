import { cn } from '@/lib/utils';
import React from 'react';

/** Shared panel surface for cards / bordered sections (admin & CMS shells). */
export const PANEL_CARD =
  'rounded-2xl border border-stone-200/90 bg-white shadow-sm';

interface PanelPageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

/** Page-level title row: stacks on mobile; title + optional actions on larger screens. */
export function PanelPageHeader({ title, description, actions, className }: PanelPageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 border-b border-stone-200/80 pb-6 sm:flex-row sm:items-start sm:justify-between sm:gap-8',
        className
      )}
    >
      <div className="min-w-0 space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">{title}</h1>
        {description ? (
          <p className="max-w-2xl text-sm leading-relaxed text-stone-600 sm:text-[15px]">{description}</p>
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
