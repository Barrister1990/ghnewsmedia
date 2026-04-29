import { cn } from '@/lib/utils';
import { UserRound } from 'lucide-react';
import React, { useState } from 'react';

export interface UserAvatarProps {
  /** Profile image URL; empty / invalid shows icon placeholder */
  src?: string | null;
  alt: string;
  /** Outer wrapper — set size here, e.g. `h-16 w-16` */
  className?: string;
  iconClassName?: string;
}

/**
 * User photo when `src` is set and loads; otherwise a neutral **icon** (no initials / no generated avatar URLs).
 */
export function UserAvatar({ src, alt, className, iconClassName }: UserAvatarProps) {
  const [broken, setBroken] = useState(false);
  const trimmed = typeof src === 'string' ? src.trim() : '';
  const showPhoto = Boolean(trimmed) && !broken;

  return (
    <span
      role="img"
      aria-label={alt}
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-muted-foreground',
        className
      )}
    >
      {showPhoto ? (
        <img
          src={trimmed}
          alt=""
          aria-hidden
          className="h-full w-full object-cover"
          onError={() => setBroken(true)}
        />
      ) : (
        <UserRound className={cn('h-[55%] w-[55%]', iconClassName)} aria-hidden strokeWidth={1.75} />
      )}
    </span>
  );
}
