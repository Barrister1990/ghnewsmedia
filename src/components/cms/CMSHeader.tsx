import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/useAuth';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import CMSNavigation from './CMSNavigation';
import CMSUserMenu from './CMSUserMenu';

interface CMSHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const CMSHeader: React.FC<CMSHeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const { userRole } = useAuth();
  const router = useRouter();
  const isMobile = useIsMobile();

  return (
    <>
      {/* Mobile Header */}
      <header className="bg-white shadow-sm border-b lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <SheetHeader className="px-4 py-6 border-b">
                  <SheetTitle className="text-left">
                    <Link href="/cms" className="text-xl font-bold text-gray-900">
                      GhNewsMedia CMS
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <CMSNavigation onNavigate={() => setSidebarOpen(false)} />
              </SheetContent>
            </Sheet>
            <Link href="/cms" className="text-lg font-bold text-gray-900">
              GhNewsMedia CMS
            </Link>
          </div>
                     
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/')}
              className="hidden sm:flex"
            >
              View Site
            </Button>
            <CMSUserMenu />
          </div>
        </div>
      </header>
       
      {/* Desktop Header */}
      <header className="bg-white shadow hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/cms" className="text-2xl font-bold text-gray-900">
                GhNewsMedia CMS
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                className="text-sm font-semibold"
                onClick={() => router.push('/')}
              >
                View News Site
              </Button>
              <span className="text-sm text-gray-500">
                Role: <span className="font-medium capitalize">{userRole}</span>
              </span>
              <CMSUserMenu />
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default CMSHeader;