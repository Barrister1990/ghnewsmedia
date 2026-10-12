import { DashShell, type DashNavItem } from '@/components/shell/DashShell';
import {
  FolderTree,
  LayoutDashboard,
  MessageSquare,
  Newspaper,
  Share2,
  Tags,
  Users,
} from 'lucide-react';
import React from 'react';
import ProtectedRoute from './ProtectedRoute';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigation: DashNavItem[] = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Articles', href: '/admin/articles', icon: Newspaper },
  { name: 'Categories', href: '/admin/categories', icon: FolderTree },
  { name: 'Tags', href: '/admin/tags', icon: Tags },
  { name: 'Comments', href: '/admin/comments', icon: MessageSquare },
  { name: 'Social Media', href: '/admin/social-media', icon: Share2 },
  { name: 'Users', href: '/admin/users', icon: Users },
];

const AdminLayout = ({ children }: AdminLayoutProps) => (
  <ProtectedRoute requiredRole="admin">
    <DashShell
      area="Admin"
      homeHref="/admin"
      newArticleHref="/admin/articles/create"
      navigation={navigation}
    >
      {children}
    </DashShell>
  </ProtectedRoute>
);

export default AdminLayout;
