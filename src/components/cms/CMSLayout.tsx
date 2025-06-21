import React, { useState } from 'react';
import CMSHeader from './CMSHeader';
import CMSProtectedRoute from './CMSProtectedRoute';
import CMSSidebar from './CMSSidebar';

interface CMSLayoutProps {
  children: React.ReactNode;
}

const CMSLayout: React.FC<CMSLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <CMSProtectedRoute>
    <div className="min-h-screen bg-gray-50">
      <CMSHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="flex h-[calc(100vh-73px)] lg:h-[calc(100vh-89px)]">
        <CMSSidebar />
        
        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
    </CMSProtectedRoute>
  );
};

export default CMSLayout;