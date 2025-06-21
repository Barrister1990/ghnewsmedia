
import React from 'react';
import CMSNavigation from './CMSNavigation';

const CMSSidebar: React.FC = () => {
  return (
    <aside className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64 bg-white border-r border-gray-200">
        <CMSNavigation />
      </div>
    </aside>
  );
};

export default CMSSidebar;
