import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { ExternalLink, LayoutDashboard, LogOut, Menu, Newspaper, UserCircle2, UserRound } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import CMSProtectedRoute from './CMSProtectedRoute';

interface CMSLayoutProps {
  children: React.ReactNode;
}

type NavItem = {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/cms', icon: LayoutDashboard },
  { name: 'Articles', href: '/cms/articles', icon: Newspaper },
  { name: 'My profile', href: '/cms/profile', icon: UserCircle2 },
];

const BRAND = 'GhNewsMedia';

const CMSLayout = ({ children }: CMSLayoutProps) => {
  const { user, signOut, userRole } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push('/auth');
  };

  const handleViewSite = () => {
    router.push('/');
  };

  const isNavActive = (href: string) => {
    if (href === '/cms') {
      return router.pathname === '/cms';
    }
    return router.pathname === href || router.pathname.startsWith(`${href}/`);
  };

  const SidebarBrand = ({ compact }: { compact?: boolean }) => (
    <div className={cn('border-b border-stone-200/80 bg-white px-4 py-5', compact && 'py-4')}>
      <Link href="/cms" className="group flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-900 text-white shadow-sm ring-1 ring-stone-900/10">
          <Newspaper className="h-5 w-5 opacity-95" aria-hidden />
        </span>
        <div className="min-w-0 pt-0.5">
          <p className="truncate text-[15px] font-semibold tracking-tight text-stone-900">{BRAND}</p>
          <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.14em] text-stone-500">Editor</p>
        </div>
      </Link>
    </div>
  );

  const SidebarNav = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className="flex-1 space-y-1 px-3 py-4" aria-label="CMS navigation">
      {navigation.map((item) => {
        const Icon = item.icon;
        const active = isNavActive(item.href);
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => onNavigate?.()}
            className={cn(
              'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
              active
                ? 'bg-stone-900 text-white shadow-sm'
                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
            )}
          >
            <Icon
              className={cn(
                'h-[18px] w-[18px] shrink-0 transition-opacity',
                active ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'
              )}
              aria-hidden
            />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );

  const SidebarFooter = () => (
    <div className="border-t border-stone-200/80 px-4 py-4">
      <p className="text-[11px] leading-relaxed text-stone-400">
        Signed in as <span className="font-medium text-stone-600">{userRole ?? 'editor'}</span>
      </p>
    </div>
  );

  return (
    <CMSProtectedRoute>
      <div className="min-h-screen bg-[#f5f4f2] text-stone-900 antialiased">
        <div className="flex min-h-screen">
          <aside className="relative hidden w-[268px] shrink-0 flex-col border-r border-stone-200/90 bg-white lg:flex lg:sticky lg:top-0 lg:h-screen lg:self-start">
            <SidebarBrand />
            <SidebarNav />
            <SidebarFooter />
          </aside>

          <div className="flex min-h-screen min-w-0 flex-1 flex-col">
            <header className="sticky top-0 z-40 border-b border-stone-200/90 bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/75">
              <div className="flex h-14 items-center gap-3 px-4 sm:h-[60px] sm:px-6">
                <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                  <SheetTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="shrink-0 border-stone-200 bg-white lg:hidden"
                      aria-label="Open navigation menu"
                    >
                      <Menu className="h-5 w-5 text-stone-700" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="flex w-[min(288px,88vw)] flex-col border-stone-200 bg-[#fafaf9] p-0">
                    <SheetHeader className="border-b border-stone-200 bg-white px-4 pb-4 pt-6 text-left">
                      <SheetTitle className="sr-only">CMS navigation</SheetTitle>
                      <SidebarBrand compact />
                    </SheetHeader>
                    <SidebarNav onNavigate={() => setSidebarOpen(false)} />
                    <SidebarFooter />
                  </SheetContent>
                </Sheet>

                <div className="flex min-w-0 flex-1 flex-col justify-center lg:hidden">
                  <span className="truncate text-sm font-semibold tracking-tight text-stone-900">{BRAND}</span>
                  <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-stone-500">Editor</span>
                </div>

                <div className="hidden min-w-0 flex-1 flex-col justify-center lg:flex">
                  <h1 className="truncate text-lg font-semibold tracking-tight text-stone-900">Editor workspace</h1>
                  <p className="text-xs text-stone-500">Drafts, your articles, and profile</p>
                </div>

                <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="hidden border-stone-200 bg-white text-stone-700 hover:bg-stone-50 sm:inline-flex"
                    onClick={handleViewSite}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View site
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="border-stone-200 bg-white sm:hidden"
                    onClick={handleViewSite}
                    aria-label="View public site"
                  >
                    <ExternalLink className="h-4 w-4 text-stone-700" />
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full border-stone-200 bg-white"
                        aria-label="Account menu"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-stone-100">
                            <UserRound className="h-4 w-4 text-stone-600" strokeWidth={1.75} />
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 border-stone-200 bg-white">
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="truncate text-sm font-medium text-stone-900">{user?.email}</p>
                          <p className="text-xs capitalize text-stone-500">{userRole}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => router.push('/cms/profile')} className="cursor-pointer">
                        My profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleViewSite} className="cursor-pointer sm:hidden">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View site
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600 focus:text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </header>

            <main className="flex-1 overflow-x-hidden overflow-y-auto">
              <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10">{children}</div>
            </main>
          </div>
        </div>
      </div>
    </CMSProtectedRoute>
  );
};

export default CMSLayout;
