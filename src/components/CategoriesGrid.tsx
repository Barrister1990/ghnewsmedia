
import {
  Briefcase,
  Car,
  Gamepad2,
  Globe,
  GraduationCap,
  Heart,
  Laptop,
  Music,
  Newspaper,
  ShoppingBag,
  TrendingUp,
  Trophy,
  Users,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { useSupabaseCategories } from '../hooks/useSupabaseCategories';

// Mapping of category names to Lucide icons
const getCategoryIcon = (categoryName: string) => {
  // Map generic category names to Lucide icons
  const genericIconMap: { [key: string]: React.ReactNode } = {
    'politics & government': <Users className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />,
    'business & finance': <Briefcase className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />,
    'sports': <Trophy className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />,
    'entertainment': <Music className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />,
    'technology & science': <Laptop className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />,
    'health & lifestyle': <Heart className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />,
    'world & local': <Globe className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />,
    'breaking news': <Zap className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />,
    'gaming': <Gamepad2 className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />,
    'travel & automotive': <Car className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />,
    'education': <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />,
    'shopping & photography': <ShoppingBag className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />,
    'trending & latest': <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />,
    'news & general': <Newspaper className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
  };

  // Normalize and match generic categories
  const normalizedName = categoryName.toLowerCase();
  for (const [key, icon] of Object.entries(genericIconMap)) {
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

  // Map categories to generic names
  const mapToGenericCategory = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('politics') || lowerName.includes('government')) return 'Politics & Government';
    if (lowerName.includes('business') || lowerName.includes('finance')) return 'Business & Finance';
    if (lowerName.includes('technology') || lowerName.includes('science')) return 'Technology & Science';
    if (lowerName.includes('health') || lowerName.includes('lifestyle')) return 'Health & Lifestyle';
    if (lowerName.includes('world') || lowerName.includes('local')) return 'World & Local';
    if (lowerName.includes('breaking')) return 'Breaking News';
    if (lowerName.includes('travel') || lowerName.includes('automotive')) return 'Travel & Automotive';
    if (lowerName.includes('shopping') || lowerName.includes('photography')) return 'Shopping & Photography';
    if (lowerName.includes('trending') || lowerName.includes('latest')) return 'Trending & Latest';
    if (lowerName.includes('education')) return 'Education';
    if (lowerName.includes('sports')) return 'Sports';
    if (lowerName.includes('entertainment')) return 'Entertainment';
    return 'News & General';
  };

  // Create a map to group categories by generic name
  const groupedCategories: { [key: string]: { color: string; slug: string; id: string }[] } = {};
  categories.forEach((category) => {
    const genericName = mapToGenericCategory(category.name);
    if (!groupedCategories[genericName]) {
      groupedCategories[genericName] = [];
    }
    groupedCategories[genericName].push({
      color: category.color,
      slug: category.slug,
      id: category.id,
    });
  });

  // Render grouped categories
  return (
    <section className="mb-8 sm:mb-10 lg:mb-12">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Browse by Category</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {Object.entries(groupedCategories).map(([genericName, cats]) => (
          <Link
            key={genericName}
            href={`/category/${cats[0].slug}`}
            className="group p-4 sm:p-5 lg:p-6 rounded-xl text-center transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
            style={{
              backgroundColor: `${cats[0].color}15`,
              borderColor: cats[0].color,
              borderWidth: '2px'
            }}
          >
            <div className="mb-2 sm:mb-3 flex justify-center" style={{ color: cats[0].color }}>
              {getCategoryIcon(genericName)}
            </div>
            <h3
              className="font-semibold text-xs sm:text-sm group-hover:scale-110 transition-transform leading-tight"
              style={{ color: cats[0].color }}
            >
              {genericName}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoriesGrid;
