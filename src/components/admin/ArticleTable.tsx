
import { formatDate } from '@/components/NewsCard/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { AdminArticle } from '@/types/news';
import {
  Eye,
  Flame,
  LayoutList,
  MoreHorizontal,
  Pencil,
  Send,
  Star,
  Trash2,
  Undo2,
} from 'lucide-react';
import Link from 'next/link';

interface ArticleTableProps {
  articles: AdminArticle[];
  onUpdateStatus: (articleId: string, newStatus: 'draft' | 'published' | 'archived') => void;
  onToggleFeatured: (articleId: string, currentFeatured: boolean) => void;
  onToggleTrending: (articleId: string, currentTrending: boolean) => void;
  onDelete: (articleId: string) => void;
}

const statusStyle = (status: string) => {
  switch (status) {
    case 'published':
      return 'border border-emerald-200/90 bg-emerald-50 text-emerald-900';
    case 'draft':
      return 'border border-amber-200/90 bg-amber-50 text-amber-900';
    case 'archived':
      return 'border border-stone-200/90 bg-stone-100 text-stone-700';
    default:
      return 'border border-stone-200/90 bg-stone-100 text-stone-800';
  }
};

const ArticleTable = ({
  articles,
  onUpdateStatus,
  onToggleFeatured,
  onToggleTrending,
  onDelete,
}: ArticleTableProps) => {
  return (
    <div className="w-full">
      <div
        className={cn(
          'flex flex-col gap-1 border-b border-stone-200/90 bg-stone-50/80 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6'
        )}
      >
        <div className="flex items-center gap-2 text-sm text-stone-600">
          <LayoutList className="h-4 w-4 text-stone-400" aria-hidden />
          <span>
            <span className="font-semibold text-stone-900">{articles.length}</span> on this page
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-stone-200 hover:bg-transparent">
              <TableHead className="min-w-[200px] pl-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500 sm:pl-6">
                Title
              </TableHead>
              <TableHead className="hidden min-w-[120px] text-xs font-semibold uppercase tracking-wider text-stone-500 md:table-cell">
                Author
              </TableHead>
              <TableHead className="hidden min-w-[100px] text-xs font-semibold uppercase tracking-wider text-stone-500 lg:table-cell">
                Category
              </TableHead>
              <TableHead className="min-w-[100px] text-xs font-semibold uppercase tracking-wider text-stone-500">
                Status
              </TableHead>
              <TableHead className="hidden min-w-[80px] text-center text-xs font-semibold uppercase tracking-wider text-stone-500 xl:table-cell">
                Flags
              </TableHead>
              <TableHead className="hidden min-w-[72px] text-right text-xs font-semibold uppercase tracking-wider text-stone-500 md:table-cell">
                Views
              </TableHead>
              <TableHead className="hidden min-w-[100px] text-xs font-semibold uppercase tracking-wider text-stone-500 lg:table-cell">
                Date
              </TableHead>
              <TableHead className="min-w-[120px] pr-4 text-right text-xs font-semibold uppercase tracking-wider text-stone-500 sm:pl-2 sm:pr-6">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-sm text-stone-500">
                  No articles match these filters on this page.
                </TableCell>
              </TableRow>
            )}
            {articles.map((article) => {
              const authorName = article.profiles?.name || article.author?.name || '—';
              return (
                <TableRow
                  key={article.id}
                  className="group border-0 border-b border-stone-100 last:border-0 hover:bg-stone-50/70"
                >
                  <TableCell className="max-w-[min(280px,50vw)] py-3 pl-4 align-top sm:max-w-xs sm:pl-6">
                    <p className="line-clamp-2 font-medium leading-snug text-stone-900" title={article.title}>
                      {article.title}
                    </p>
                    <p className="mt-0.5 font-mono text-[11px] text-stone-400 sm:text-xs">{article.slug}</p>
                  </TableCell>
                  <TableCell className="hidden align-top text-sm text-stone-600 md:table-cell">
                    {authorName}
                  </TableCell>
                  <TableCell className="hidden align-top lg:table-cell">
                    {article.category ? (
                      <Badge
                        className="font-medium text-white shadow-none ring-1 ring-black/5"
                        style={{ backgroundColor: article.category.color || '#57534e' }}
                      >
                        {article.category.name}
                      </Badge>
                    ) : (
                      <span className="text-sm text-stone-400">—</span>
                    )}
                  </TableCell>
                  <TableCell className="align-top">
                    <Badge variant="outline" className={cn('capitalize', statusStyle(article.status))}>
                      {article.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden align-top xl:table-cell">
                    <div className="flex flex-wrap justify-center gap-1">
                      {article.featured && (
                        <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-900">
                          <Star className="mr-1 h-3 w-3" aria-hidden />
                          Featured
                        </Badge>
                      )}
                      {article.trending && (
                        <Badge variant="outline" className="border-orange-200 bg-orange-50 text-orange-900">
                          <Flame className="mr-1 h-3 w-3" aria-hidden />
                          Trend
                        </Badge>
                      )}
                      {!article.featured && !article.trending && (
                        <span className="text-xs text-stone-400">—</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden align-top text-right text-sm tabular-nums text-stone-700 md:table-cell">
                    <span className="inline-flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5 text-stone-400" aria-hidden />
                      {article.views?.toLocaleString?.() ?? article.views}
                    </span>
                  </TableCell>
                  <TableCell className="hidden align-top text-sm text-stone-600 lg:table-cell">
                    {formatDate(article.published_at || article.created_at)}
                  </TableCell>
                  <TableCell className="py-3 pr-4 text-right align-middle sm:pr-6">
                    <div className="flex flex-wrap items-center justify-end gap-1">
                      <Button variant="outline" size="icon" className="h-8 w-8 border-stone-200 bg-white" asChild>
                        <Link href={`/admin/articles/edit/${article.id}`} aria-label={`Edit ${article.title}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 border-stone-200 bg-white"
                            aria-label="More actions"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52 border-stone-200 bg-white">
                          {article.status === 'draft' && (
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => onUpdateStatus(article.id, 'published')}
                            >
                              <Send className="mr-2 h-4 w-4" />
                              Publish
                            </DropdownMenuItem>
                          )}
                          {article.status === 'published' && (
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => onUpdateStatus(article.id, 'draft')}
                            >
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
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ArticleTable;
