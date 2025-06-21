import { useAuth } from '@/hooks/useAuth';
import { Home, Lock, Shield } from 'lucide-react';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'editor' | 'moderator';
}

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>
      
      {/* Main loading content */}
      <div className="relative z-10 text-center">
        {/* Animated shield icon */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-xl opacity-75 animate-pulse"></div>
          <div className="relative bg-white/10 backdrop-blur-sm rounded-full p-6 border border-white/20">
            <Shield className="w-16 h-16 text-white animate-pulse" />
          </div>
        </div>
        
        {/* Loading spinner */}
        <div className="relative mb-6">
          <div className="w-20 h-20 mx-auto">
            <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-white rounded-full animate-spin"></div>
          </div>
        </div>
        
        {/* Loading text */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-white animate-pulse">
            Securing your session
          </h2>
          <p className="text-white/70 animate-pulse delay-200">
            Please wait while we verify your access...
          </p>
        </div>
        
        {/* Animated dots */}
        <div className="flex justify-center space-x-2 mt-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AccessDeniedScreen = () => {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-pink-900 to-purple-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 text-center max-w-md mx-auto px-6">
        {/* Animated lock icon */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full blur-xl opacity-75 animate-pulse"></div>
          <div className="relative bg-white/10 backdrop-blur-sm rounded-full p-6 border border-white/20 transform hover:scale-105 transition-transform duration-300">
            <Lock className="w-16 h-16 text-white animate-pulse" />
          </div>
        </div>
        
        {/* Error content */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 shadow-2xl transform hover:scale-[1.02] transition-transform duration-300">
          <h1 className="text-4xl font-bold text-white mb-4 animate-fade-in">
            Access Denied
          </h1>
          <p className="text-white/80 text-lg mb-8 leading-relaxed animate-fade-in delay-200">
            You don't have the required permissions to access this page. 
            Please contact your administrator if you believe this is an error.
          </p>
          
          {/* Action button */}
          <button
            onClick={handleGoHome}
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/50"
          >
            <Home className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            Return Home
          </button>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -top-4 -right-4 w-8 h-8 bg-white/20 rounded-full animate-ping"></div>
        <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-white/30 rounded-full animate-ping delay-1000"></div>
      </div>
      
      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}
        ></div>
      ))}
      
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        
        .animate-fade-in.delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole
}) => {
  const { user, loading, userRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      // Store the current path to redirect back after login
      const returnUrl = router.asPath;
      router.push(`/auth?returnUrl=${encodeURIComponent(returnUrl)}`);
    }
  }, [user, loading, router]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    // Return null while redirecting to prevent flash of content
    return null;
  }

  if (requiredRole && userRole !== requiredRole && userRole !== 'admin') {
    return <AccessDeniedScreen />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;