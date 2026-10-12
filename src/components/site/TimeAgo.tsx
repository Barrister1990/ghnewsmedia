import { useEffect, useState } from 'react';

const DAY_MS = 24 * 60 * 60 * 1000;

/** Fixed-timezone date so server and browser render the same text. */
export const formatPublishedDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Africa/Accra',
  });

/** Date and time for article bylines, e.g. "4 Oct 2026, 13:05 GMT" (Ghana is on GMT all year). */
export const formatPublishedDateTime = (iso: string) => {
  const date = new Date(iso);
  const day = formatPublishedDate(iso);
  const time = date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Africa/Accra',
  });
  return `${day}, ${time} GMT`;
};

const relative = (iso: string, now: number): string | null => {
  const diff = now - new Date(iso).getTime();
  if (diff < 0 || diff >= DAY_MS) return null;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  return `${Math.floor(minutes / 60)}h ago`;
};

/**
 * Renders the absolute date on the server (cached pages stay correct), then switches
 * to "12m ago" in the browser for stories under a day old.
 */
const TimeAgo = ({ date, prefix = 'Published', className = '' }: { date: string; prefix?: string; className?: string }) => {
  const [rel, setRel] = useState<string | null>(null);

  useEffect(() => {
    setRel(relative(date, Date.now()));
  }, [date]);

  return (
    <time dateTime={new Date(date).toISOString()} className={className}>
      {rel ? `${prefix} ${rel}` : `${prefix} On ${formatPublishedDate(date)}`}
    </time>
  );
};

export default TimeAgo;
