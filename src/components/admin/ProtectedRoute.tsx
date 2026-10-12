import { DashScreen } from '@/components/shell/DashShell';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'editor';
}

export const accessDeniedAction = (
  <div className="flex flex-wrap justify-center gap-3">
    <Link
      href="/"
      className="inline-flex h-11 items-center rounded-full bg-dash-teal-dark px-6 text-sm font-bold text-white hover:bg-dash-teal-deep"
    >
      Go to homepage
    </Link>
    <Link
      href="/auth"
      className="inline-flex h-11 items-center rounded-full border border-dash-ink px-6 text-sm font-bold hover:bg-dash-ink hover:text-white"
    >
      Switch account
    </Link>
  </div>
);

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
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

  if (requiredRole && userRole !== requiredRole && userRole !== 'admin') {
    return (
      <DashScreen
        title="Access denied"
        message="Your account doesn't have permission to open this area. Sign in with an administrator account or head back to the site."
        action={accessDeniedAction}
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
