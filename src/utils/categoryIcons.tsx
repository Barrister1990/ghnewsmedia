
import {
  Activity,
  Briefcase,
  Building,
  Camera,
  Car,
  Clock,
  Gamepad2,
  Globe,
  GraduationCap,
  Heart,
  Home,
  Laptop,
  LucideIcon,
  Music,
  Newspaper,
  Plane,
  ShoppingBag,
  TrendingUp,
  Trophy,
  Users,
  Zap
} from 'lucide-react';
import React from 'react';



// Get the appropriate Lucide icon component for a category name
export const getCategoryIconComponent = (categoryName: string): LucideIcon => {
  const iconMap: { [key: string]: LucideIcon } = {
    'politics': Users,
    'business': Briefcase,
    'sports': Trophy,
    'entertainment': Music,
    'technology': Laptop,
    'health': Heart,
    'science': Zap,
    'world': Globe,
    'local': Home,
    'breaking': Zap,
    'gaming': Gamepad2,
    'travel': Plane,
    'automotive': Car,
    'lifestyle': Activity,
    'education': GraduationCap,
    'finance': TrendingUp,
    'real estate': Building,
    'shopping': ShoppingBag,
    'photography': Camera,
    'trending': TrendingUp,
    'latest': Clock,
    'news': Newspaper,
    'general': Newspaper
  };

  const normalizedName = categoryName.toLowerCase();
  for (const [key, IconComponent] of Object.entries(iconMap)) {
    if (normalizedName.includes(key)) {
      return IconComponent;
    }
  }

  return Newspaper;
};

// Get a rendered icon element for a category name
export const getCategoryIcon = (categoryName: string, className: string = "w-4 h-4"): React.ReactNode => {
  const IconComponent = getCategoryIconComponent(categoryName);
  return <IconComponent className={className} />;
};
