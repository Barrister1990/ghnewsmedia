import { DashShell, type DashNavItem } from '@/components/shell/DashShell';
import { LayoutDashboard, Newspaper, UserCircle2 } from 'lucide-react';
import React from 'react';
import CMSProtectedRoute from './CMSProtectedRoute';

interface CMSLayoutProps {
  children: React.ReactNode;
}

const navigation: DashNavItem[] = [
  { name: 'Dashboard', href: '/cms', icon: LayoutDashboard },
  { name: 'Articles', href: '/cms/articles', icon: Newspaper },
  { name: 'My profile', href: '/cms/profile', icon: UserCircle2 },
];

const CMSLayout = ({ children }: CMSLayoutProps) => (
  <CMSProtectedRoute>
    <DashShell
      area="Newsroom"
      homeHref="/cms"
      newArticleHref="/cms/articles/create"
      profileHref="/cms/profile"
      navigation={navigation}
    >
      {children}
    </DashShell>
  </CMSProtectedRoute>
);

export default CMSLayout;
