import { accessDeniedAction } from '@/components/admin/ProtectedRoute';
import { DashScreen } from '@/components/shell/DashShell';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

interface CMSProtectedRouteProps {
  children: React.ReactNode;
}

const CMSProtectedRoute: React.FC<CMSProtectedRouteProps> = ({ children }) => {
  const { user, loading, userRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/auth?returnUrl=${encodeURIComponent(router.asPath)}`);
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <DashScreen busy />;
  }

  if (userRole !== 'editor') {
    return (
      <DashScreen
        title="Access denied"
        message="The newsroom is for editor accounts. Administrators manage content from the Admin dashboard."
        action={accessDeniedAction}
      />
    );
  }

  return <>{children}</>;
};

export default CMSProtectedRoute;
