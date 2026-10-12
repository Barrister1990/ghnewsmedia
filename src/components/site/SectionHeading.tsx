import Link from 'next/link';

interface SectionHeadingProps {
  title: string;
  href?: string;
  as?: 'h1' | 'h2' | 'h3';
  dark?: boolean;
  className?: string;
}

const SectionHeading = ({ title, href, as: Tag = 'h2', dark = false, className = '' }: SectionHeadingProps) => (
  <div className={`mb-4 flex items-end justify-between border-b-2 ${dark ? 'border-white/25' : 'border-gp-ink'} ${className}`}>
    <Tag className={`relative -mb-[2px] border-b-[3px] border-gp-accent pb-1.5 text-xl font-bold leading-tight sm:text-2xl ${dark ? 'text-white' : 'text-gp-ink'}`}>
      {href ? <Link href={href} className="hover:underline">{title}</Link> : title}
    </Tag>
    {href && (
      <Link href={href} className={`pb-1.5 text-xs font-bold uppercase tracking-wide ${dark ? 'text-white/80 hover:text-white' : 'text-gp-muted hover:text-gp-ink'}`}>
        See all
      </Link>
    )}
  </div>
);

export default SectionHeading;
