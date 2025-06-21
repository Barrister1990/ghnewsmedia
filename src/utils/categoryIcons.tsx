
import React from 'react';
import { 
  Newspaper, 
  TrendingUp, 
  Briefcase, 
  Trophy, 
  Gamepad2, 
  Heart, 
  Zap, 
  Globe, 
  Users, 
  Car,
  Plane,
  Music,
  Camera,
  Laptop,
  Building,
  GraduationCap,
  Activity,
  ShoppingBag,
  Home,
  Clock,
  LucideIcon
} from 'lucide-react';

interface CategoryIconProps {
  className?: string;
}

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
