
import { ADMIN_PANEL_CARD } from '@/components/admin/AdminPageHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { AdminArticle } from '@/types/news';
import { formatDate } from '@/components/NewsCard/utils';
import {
  Eye,
  Flame,
  LayoutGrid,
  MoreHorizontal,
  Newspaper,
  Pencil,
  Send,
  Star,
  Trash2,
  Undo2,
} from 'lucide-react';
import Link from 'next/link';

interface ArticleCardsProps {
  articles: AdminArticle[];
  onUpdateStatus: (articleId: string, newStatus: 'draft' | 'published' | 'archived') => void;
  onToggleFeatured: (articleId: string, currentFeatured: boolean) => void;
  onToggleTrending: (articleId: string, currentTrending: boolean) => void;
  onDelete: (articleId: string) => void;
}

const statusStyle = (status: string) => {
  switch (status) {
    case 'published':
      return 'border-emerald-200 bg-emerald-50 text-emerald-900';
    case 'draft':
      return 'border-amber-200 bg-amber-50 text-amber-900';
    case 'archived':
      return 'border-stone-200 bg-stone-100 text-stone-700';
    default:
      return 'border-stone-200 bg-stone-100 text-stone-800';
  }
};

const ArticleCards = ({
  articles,
  onUpdateStatus,
  onToggleFeatured,
  onToggleTrending,
  onDelete,
}: ArticleCardsProps) => {
  return (
    <div className="p-4 sm:p-6">
      <div className="mb-4 flex items-center gap-2 text-sm text-stone-600">
        <LayoutGrid className="h-4 w-4 text-stone-400" aria-hidden />
        <span>
          <span className="font-semibold text-stone-900">{articles.length}</span> cards on this page
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {articles.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-stone-200 bg-stone-50/80 px-6 py-14 text-center">
            <Newspaper className="mx-auto mb-3 h-10 w-10 text-stone-300" strokeWidth={1.25} aria-hidden />
            <p className="font-medium text-stone-700">No articles here</p>
            <p className="mt-1 text-sm text-stone-500">Adjust filters or switch pages.</p>
          </div>
        )}
        {articles.map((article) => {
          const authorName = article.profiles?.name || article.author?.name || 'Unknown author';
          const imgSrc = article.featured_image?.trim();
          return (
            <article
              key={article.id}
              className={cn(
                ADMIN_PANEL_CARD,
                'flex flex-col overflow-hidden transition-shadow hover:shadow-md'
              )}
            >
              <Link href={`/admin/articles/edit/${article.id}`} className="relative block aspect-[16/10] overflow-hidden bg-stone-100">
                {imgSrc ? (
                  <img
                    src={imgSrc}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-stone-100 to-stone-200/90 text-stone-400">
                    <Newspaper className="h-10 w-10 opacity-60" strokeWidth={1.25} aria-hidden />
                    <span className="text-xs font-medium uppercase tracking-wider">No image</span>
                  </div>
                )}
                <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                  <Badge variant="outline" className={cn('border bg-white/95 capitalize shadow-sm backdrop-blur-sm', statusStyle(article.status))}>
                    {article.status}
                  </Badge>
                  {article.featured && (
                    <Badge variant="outline" className="border-amber-200 bg-amber-50/95 text-amber-900 backdrop-blur-sm">
                      <Star className="mr-1 h-3 w-3" aria-hidden />
                      Featured
                    </Badge>
                  )}
                  {article.trending && (
                    <Badge variant="outline" className="border-orange-200 bg-orange-50/95 text-orange-900 backdrop-blur-sm">
                      <Flame className="mr-1 h-3 w-3" aria-hidden />
                      Trending
                    </Badge>
                  )}
                </div>
              </Link>

              <div className="flex flex-1 flex-col gap-3 p-4">
                <div className="min-h-0 flex-1 space-y-2">
                  <Link href={`/admin/articles/edit/${article.id}`}>
                    <h3 className="line-clamp-2 text-base font-semibold leading-snug tracking-tight text-stone-900 hover:text-stone-700">
                      {article.title}
                    </h3>
                  </Link>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-500">
                    <span className="truncate">{authorName}</span>
                    <span className="hidden text-stone-300 sm:inline">·</span>
                    <span className="inline-flex items-center gap-1 tabular-nums">
                      <Eye className="h-3.5 w-3.5" aria-hidden />
                      {article.views?.toLocaleString?.() ?? article.views}
                    </span>
                  </div>
                  {article.category && (
                    <Badge
                      className="mt-1 font-medium text-white shadow-none ring-1 ring-black/5"
                      style={{ backgroundColor: article.category.color || '#57534e' }}
                    >
                      {article.category.name}
                    </Badge>
                  )}
                  <p className="text-[11px] text-stone-400">
                    {formatDate(article.published_at || article.created_at)}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-2 border-t border-stone-100 pt-3">
                  <Button variant="outline" size="sm" className="border-stone-200 bg-white" asChild>
                    <Link href={`/admin/articles/edit/${article.id}`} className="gap-2">
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="border-stone-200 bg-white" aria-label="More actions">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52 border-stone-200 bg-white">
                      {article.status === 'draft' && (
                        <DropdownMenuItem className="cursor-pointer" onClick={() => onUpdateStatus(article.id, 'published')}>
                          <Send className="mr-2 h-4 w-4" />
                          Publish
                        </DropdownMenuItem>
                      )}
                      {article.status === 'published' && (
                        <DropdownMenuItem className="cursor-pointer" onClick={() => onUpdateStatus(article.id, 'draft')}>
                          <Undo2 className="mr-2 h-4 w-4" />
                          Move to draft
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => onToggleFeatured(article.id, article.featured)}
                      >
                        <Star className="mr-2 h-4 w-4" />
                        {article.featured ? 'Remove featured' : 'Mark featured'}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => onToggleTrending(article.id, article.trending)}
                      >
                        <Flame className="mr-2 h-4 w-4" />
                        {article.trending ? 'Remove trending' : 'Mark trending'}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="cursor-pointer text-red-600 focus:text-red-600"
                        onClick={() => onDelete(article.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default ArticleCards;
