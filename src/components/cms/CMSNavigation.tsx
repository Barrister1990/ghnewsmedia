import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

interface NavigationItem {
  name: string;
  href: string;
  icon: string;
}

interface CMSNavigationProps {
  onNavigate?: () => void;
}

const CMSNavigation: React.FC<CMSNavigationProps> = ({ onNavigate }) => {
  const router = useRouter();

  const navigation: NavigationItem[] = [
    { name: 'Dashboard', href: '/cms', icon: '📊' },
    { name: 'Articles', href: '/cms/articles', icon: '📝' },
    { name: 'My Profile', href: '/cms/profile', icon: '👤' },
  ];

  return (
    <nav className="space-y-1 p-4">
      {navigation.map((item) => {
        const isActive = router.pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={onNavigate}
            className={`
              group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full
              ${isActive
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }
            `}
          >
            <span className="mr-3 text-lg">{item.icon}</span>
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
};

export default CMSNavigation;