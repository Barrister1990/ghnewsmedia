import React from 'react';

const AnimatedLoading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center space-y-8">
        {/* Main Loading Animation */}
        <div className="relative">
          {/* Outer Ring */}
          <div className="w-24 h-24 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto"></div>
          
          {/* Inner Pulsing Dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
          </div>
          
          {/* Floating Particles */}
          <div className="absolute -top-2 -left-2 w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
          <div className="absolute -top-2 -right-2 w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
          <div className="absolute -bottom-2 -right-2 w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.6s'}}></div>
        </div>

        {/* Loading Text with Typing Effect */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-slate-800 animate-pulse">
            Loading
            <span className="animate-ping text-blue-600">.</span>
            <span className="animate-ping text-indigo-600" style={{animationDelay: '0.2s'}}>.</span>
            <span className="animate-ping text-purple-600" style={{animationDelay: '0.4s'}}>.</span>
          </h2>
          
          {/* Progress Bar */}
          <div className="w-64 mx-auto">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          {/* Subtitle */}
          <p className="text-slate-600 animate-fade-in">
            Please wait while we prepare everything for you...
          </p>
        </div>

        {/* Skeleton Content Preview */}
        <div className="max-w-md mx-auto space-y-4 pt-8">
          <div className="animate-pulse space-y-3">
            {/* Header Skeleton */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2"></div>
              </div>
            </div>
            
            {/* Content Skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-5/6"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-4/6"></div>
            </div>
            
            {/* Card Skeletons */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              <div className="h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg"></div>
              <div className="h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/4 right-8 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 left-8 w-20 h-20 bg-pink-200 rounded-full opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-8 right-1/4 w-12 h-12 bg-indigo-200 rounded-full opacity-20 animate-pulse" style={{animationDelay: '1.5s'}}></div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 2s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  );
};

// Loading wrapper component with timer
const LoadingWrapper = ({ children, loadingTime = 3000 }) => {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, loadingTime);

    return () => clearTimeout(timer);
  }, [loadingTime]);

  if (loading) {
    return <AnimatedLoading />;
  }

  return children;
};




// Named exports
export { AnimatedLoading, LoadingWrapper };

