import { cn } from '@/lib/utils';

interface DashLogoProps {
  tone?: 'dark' | 'light';
  className?: string;
}

/** Ghana Point wordmark rendered inline so it can sit on light or dark surfaces. */
export function DashLogo({ tone = 'dark', className }: DashLogoProps) {
  const ghana = tone === 'light' ? '#ffffff' : '#0B3C5D';
  const point = tone === 'light' ? '#ff5c5c' : '#B11212';
  return (
    <svg
      viewBox="0 0 220 48"
      role="img"
      aria-label="Ghana Point"
      className={cn('h-7 w-auto', className)}
    >
      <text
        x="0"
        y="34"
        fontSize="30"
        fontWeight="900"
        fontFamily="var(--font-gp), Arial, Helvetica, sans-serif"
        letterSpacing="-0.5"
      >
        <tspan fill={ghana}>GHANA</tspan>
        <tspan dx="6" fill={point}>
          POINT
        </tspan>
      </text>
    </svg>
  );
}
