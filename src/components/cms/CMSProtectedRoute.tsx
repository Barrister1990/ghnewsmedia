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
      // Store the current route to redirect back after login
      const returnUrl = router.asPath;
      router.replace(`/auth?returnUrl=${encodeURIComponent(returnUrl)}`);
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    // Return loading state while redirect is happening
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (userRole !== 'editor') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You need editor privileges to access the CMS.</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default CMSProtectedRoute;