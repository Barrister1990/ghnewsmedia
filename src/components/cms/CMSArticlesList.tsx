import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { AdminArticle as Article } from '@/types/news';
import { Edit, Eye, LayoutList } from 'lucide-react';
import { useRouter } from 'next/router';

interface CMSArticlesListProps {
  articles: Article[];
  loading: boolean;
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

const CMSArticlesList = ({ articles, loading }: CMSArticlesListProps) => {
  const router = useRouter();
  const { user } = useAuth();

  const canEditArticle = (authorId: string) => {
    return user?.id === authorId;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center px-6 py-16">
        <div className="text-sm text-stone-500">Loading articles…</div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
        <p className="text-sm font-medium text-stone-800">No articles match your filters</p>
        <p className="max-w-sm text-sm text-stone-500">Try adjusting search or status filters.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-1 border-b border-stone-200/90 bg-stone-50/80 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-2 text-sm text-stone-600">
          <LayoutList className="h-4 w-4 text-stone-400" aria-hidden />
          <span>
            <span className="font-semibold text-stone-900">{articles.length}</span> articles
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-stone-200/90 hover:bg-transparent">
              <TableHead className="whitespace-nowrap text-stone-700">Title</TableHead>
              <TableHead className="whitespace-nowrap text-stone-700">Author</TableHead>
              <TableHead className="whitespace-nowrap text-stone-700">Category</TableHead>
              <TableHead className="whitespace-nowrap text-stone-700">Status</TableHead>
              <TableHead className="whitespace-nowrap text-stone-700">Views</TableHead>
              <TableHead className="whitespace-nowrap text-stone-700">Created</TableHead>
              <TableHead className="text-right whitespace-nowrap text-stone-700">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.map((article) => (
              <TableRow key={article.id} className="border-stone-200/80">
                <TableCell className="max-w-[min(280px,46vw)] align-top">
                  <div>
                    <p className="font-medium leading-snug text-stone-900">{article.title}</p>
                    {article.excerpt ? (
                      <p className="mt-0.5 line-clamp-2 text-xs text-stone-500">{article.excerpt}</p>
                    ) : null}
                  </div>
                </TableCell>
                <TableCell className="align-top text-sm text-stone-700">
                  {article.author?.name || 'Unknown'}
                </TableCell>
                <TableCell className="align-top">
                  <Badge variant="outline" className="border-stone-200/90 bg-white text-xs font-normal text-stone-700">
                    {article.category?.name || 'Uncategorized'}
                  </Badge>
                </TableCell>
                <TableCell className="align-top">
                  <Badge className={cn('text-xs font-medium capitalize shadow-none', statusStyle(article.status))}>
                    {article.status}
                  </Badge>
                </TableCell>
                <TableCell className="align-top text-sm tabular-nums text-stone-600">{article.views}</TableCell>
                <TableCell className="align-top text-sm text-stone-500">
                  {new Date(article.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="align-top text-right">
                  <div className="flex flex-wrap items-center justify-end gap-1">
                    {article.status === 'published' && article.category && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                        onClick={() => {
                          window.open(`/${article.category!.slug}/${article.slug}`, '_blank');
                        }}
                        aria-label="View on site"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    {canEditArticle(article.author_id) ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                        onClick={() => router.push(`/cms/articles/edit/${article.id}`)}
                        aria-label="Edit article"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    ) : (
                      <span className="px-2 text-xs text-stone-400">View only</span>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CMSArticlesList;
