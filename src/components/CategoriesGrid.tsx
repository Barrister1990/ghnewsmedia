
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
  Clock
} from 'lucide-react';
import { useSupabaseCategories } from '../hooks/useSupabaseCategories';

// Mapping of category names to Lucide icons
const getCategoryIcon = (categoryName: string) => {
  // Map common category names to Lucide icons
  const iconMap: { [key: string]: React.ReactNode } = {
    'politics': <Users className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />,
    'business': <Briefcase className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />,
    'sports': <Trophy className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />,
    'entertainment': <Music className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />,
    'technology': <Laptop className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />,
    'health': <Heart className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />,
    'science': <Zap className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />,
    'world': <Globe className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />,
    'local': <Home className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />,
    'breaking': <Zap className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />,
    'gaming': <Gamepad2 className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />,
    'travel': <Plane className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />,
    'automotive': <Car className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />,
    'lifestyle': <Activity className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />,
    'education': <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />,
    'finance': <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />,
    'real estate': <Building className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />,
    'shopping': <ShoppingBag className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />,
    'photography': <Camera className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />,
    'trending': <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />,
    'latest': <Clock className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />,
    'news': <Newspaper className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />,
    'general': <Newspaper className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
  };

  // Try to find a match by category name (case insensitive)
  const normalizedName = categoryName.toLowerCase();
  for (const [key, icon] of Object.entries(iconMap)) {
    if (normalizedName.includes(key)) {
      return icon;
    }
  }

  // Default to newspaper icon
  return <Newspaper className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />;
};

const CategoriesGrid = () => {
  const { categories, loading } = useSupabaseCategories();

  if (loading) {
    return (
      <section className="mb-8 sm:mb-10 lg:mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Browse by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-4 sm:p-5 lg:p-6 rounded-xl animate-pulse">
              <div className="text-4xl mb-2 sm:mb-3 bg-gray-200 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="mb-8 sm:mb-10 lg:mb-12">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Browse by Category</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {categories.map((category) => (
          <a
            key={category.id}
            href={`/category/${category.slug}`}
            className="group p-4 sm:p-5 lg:p-6 rounded-xl text-center transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
            style={{
              backgroundColor: `${category.color}15`,
              borderColor: category.color,
              borderWidth: '2px'
            }}
          >
            <div className="mb-2 sm:mb-3 flex justify-center" style={{ color: category.color }}>
              {getCategoryIcon(category.name)}
            </div>
            <h3
              className="font-semibold text-xs sm:text-sm group-hover:scale-110 transition-transform leading-tight"
              style={{ color: category.color }}
            >
              {category.name}
            </h3>
          </a>
        ))}
      </div>
    </section>
  );
};

export default CategoriesGrid;
