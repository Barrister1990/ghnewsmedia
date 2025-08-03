import { useTags } from '@/hooks/useTags';
import { Hash, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from './ui/skeleton';

const TrendingTopics = () => {
  const { tags, loading } = useTags();

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-4">
        <TrendingUp className="w-6 h-6 text-primary" />
        <h3 className="font-bold text-xl text-gray-900">Trending Topics</h3>
      </div>
      
      {loading ? (
        <div className="space-y-3">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tags.slice(0, 15).map((tag) => (
           <Link
  href={`/search?tag=${tag.slug}`}
  key={tag.id}
  className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-full transition-colors text-sm font-medium"
>
  <Hash className="w-3.5 h-3.5 text-gray-500" />
  {tag.name}
</Link>
          ))}
        </div>
      )}
      
      {tags.length > 15 && (
       <Link
  href="/search?view=tags"
  className="w-full mt-6 block text-center text-sm text-primary hover:text-primary-700 font-medium transition-colors"
>
  View All Topics
</Link>
      )}
    </section>
  );
};

export default TrendingTopics;
