import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { ArrowUpRight, LogOut, Menu, PenSquare, ShieldCheck, UserRound } from 'lucide-react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { DashLogo } from './DashLogo';

export type DashNavItem = {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

interface DashShellProps {
  area: 'Admin' | 'Newsroom';
  homeHref: string;
  newArticleHref: string;
  profileHref?: string;
  navigation: DashNavItem[];
  children: React.ReactNode;
}

const initialsFor = (email?: string | null) => {
  if (!email) return 'GP';
  const name = email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').trim();
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return (name.slice(0, 2) || 'GP').toUpperCase();
};

function SidebarContent({
  area,
  homeHref,
  newArticleHref,
  navigation,
  pathname,
  onNavigate,
}: {
  area: DashShellProps['area'];
  homeHref: string;
  newArticleHref: string;
  navigation: DashNavItem[];
  pathname: string;
  onNavigate?: () => void;
}) {
  const isActive = (href: string) =>
    href === homeHref ? pathname === homeHref : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2 px-5 pb-4 pt-6">
        <Link href={homeHref} onClick={onNavigate} className="flex items-center" aria-label={`Ghana Point ${area}`}>
          <DashLogo className="h-6" />
        </Link>
        <span className="rounded-full bg-dash-mint px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-dash-teal-deep">
          {area}
        </span>
      </div>

      <div className="px-4 pb-2">
        <Link
          href={newArticleHref}
          onClick={onNavigate}
          className="flex h-11 items-center justify-center gap-2 rounded-full bg-dash-teal-dark text-sm font-bold text-white shadow-sm transition-colors hover:bg-dash-teal-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dash-teal focus-visible:ring-offset-2"
        >
          <PenSquare className="h-4 w-4" aria-hidden />
          New article
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3" aria-label={`${area} navigation`}>
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'group flex items-center gap-3 rounded-full px-4 py-2.5 text-[14px] font-medium transition-colors',
                active
                  ? 'bg-dash-ink text-white'
                  : 'text-dash-muted hover:bg-dash-mist hover:text-dash-ink'
              )}
            >
              <Icon className={cn('h-[18px] w-[18px] shrink-0', active ? 'text-dash-teal' : '')} aria-hidden />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4">
        <div className="rounded-2xl bg-dash-ink p-4 text-white">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-dash-teal/15">
              <ShieldCheck className="h-4 w-4 text-dash-teal" aria-hidden />
            </span>
            <p className="text-sm font-bold">Publishing standards</p>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-white/65">
            Clear headlines, credited 1200×675 images and a real byline help stories land in Google News.
          </p>
          <Link
            href="/editorial-policy"
            target="_blank"
            className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-dash-teal hover:underline"
          >
            Editorial policy <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  );
}

export function DashShell({
  area,
  homeHref,
  newArticleHref,
  profileHref,
  navigation,
  children,
}: DashShellProps) {
  const { user, signOut, userRole } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const current =
    navigation.find((item) =>
      item.href === homeHref
        ? router.pathname === homeHref
        : router.pathname === item.href || router.pathname.startsWith(`${item.href}/`)
    )?.name ?? area;

  const handleSignOut = async () => {
    await signOut();
    router.push('/auth');
  };

  return (
    <div className="gp-dash min-h-screen bg-dash-mist text-dash-ink">
      <Head>
        <title>{`${current} · Ghana Point ${area}`}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="flex min-h-screen">
        <aside className="sticky top-0 hidden h-screen w-[264px] shrink-0 border-r border-dash-line bg-white lg:block">
          <SidebarContent
            area={area}
            homeHref={homeHref}
            newArticleHref={newArticleHref}
            navigation={navigation}
            pathname={router.pathname}
          />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 border-b border-dash-line bg-white/85 backdrop-blur-md">
            <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-10">
              <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                <SheetTrigger asChild>
                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-dash-line bg-white text-dash-ink lg:hidden"
                    aria-label="Open navigation menu"
                  >
                    <Menu className="h-5 w-5" />
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="gp-dash w-[min(288px,88vw)] border-dash-line bg-white p-0">
                  <SheetTitle className="sr-only">{area} navigation</SheetTitle>
                  <SidebarContent
                    area={area}
                    homeHref={homeHref}
                    newArticleHref={newArticleHref}
                    navigation={navigation}
                    pathname={router.pathname}
                    onNavigate={() => setMenuOpen(false)}
                  />
                </SheetContent>
              </Sheet>

              <Link href={homeHref} className="lg:hidden" aria-label={`Ghana Point ${area}`}>
                <DashLogo className="h-5" />
              </Link>

              <div className="hidden min-w-0 items-center gap-2 text-sm lg:flex">
                <span className="text-dash-muted">{area}</span>
                <span className="text-dash-line">/</span>
                <span className="truncate font-bold">{current}</span>
              </div>

              <div className="ml-auto flex items-center gap-2 sm:gap-3">
                <Link
                  href="/"
                  target="_blank"
                  className="hidden h-10 items-center gap-1.5 rounded-full border border-dash-ink px-4 text-sm font-bold transition-colors hover:bg-dash-ink hover:text-white sm:inline-flex"
                >
                  View site <ArrowUpRight className="h-4 w-4" aria-hidden />
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="flex items-center gap-2 rounded-full border border-dash-line bg-white p-1 pr-1 transition-colors hover:border-dash-ink/30 sm:pr-3"
                      aria-label="Account menu"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-dash-yellow text-xs font-black text-dash-ink">
                          {initialsFor(user?.email)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden text-xs font-bold capitalize sm:inline">{userRole ?? 'member'}</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-60 rounded-2xl p-2">
                    <DropdownMenuLabel className="font-normal">
                      <p className="truncate text-sm font-bold">{user?.email}</p>
                      <p className="text-xs capitalize text-dash-muted">{userRole}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {profileHref ? (
                      <DropdownMenuItem asChild className="cursor-pointer rounded-xl">
                        <Link href={profileHref}>
                          <UserRound className="mr-2 h-4 w-4" />
                          My profile
                        </Link>
                      </DropdownMenuItem>
                    ) : null}
                    <DropdownMenuItem asChild className="cursor-pointer rounded-xl sm:hidden">
                      <Link href="/" target="_blank">
                        <ArrowUpRight className="mr-2 h-4 w-4" />
                        View site
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="cursor-pointer rounded-xl text-red-600 focus:text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-x-hidden">
            <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}

/** Full-screen state used while auth resolves or access is refused. */
export function DashScreen({
  title,
  message,
  action,
  busy,
}: {
  title?: string;
  message?: string;
  action?: React.ReactNode;
  busy?: boolean;
}) {
  return (
    <div className="gp-dash flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center text-dash-ink">
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <DashLogo className="h-8" />
      {busy ? (
        <div className="mt-8 flex items-center gap-1.5" role="status" aria-label="Loading">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2.5 w-2.5 animate-bounce rounded-full bg-dash-teal-dark motion-reduce:animate-none"
              style={{ animationDelay: `${i * 0.12}s` }}
            />
          ))}
        </div>
      ) : null}
      {title ? <h1 className="mt-8 text-3xl font-black sm:text-4xl">{title}</h1> : null}
      {message ? <p className="mt-3 max-w-md text-dash-muted">{message}</p> : null}
      {action ? <div className="mt-8">{action}</div> : null}
    </div>
  );
}
