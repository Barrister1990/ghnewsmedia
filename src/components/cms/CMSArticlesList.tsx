
import { useRouter } from 'next/router';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAllArticles } from '@/hooks/useAllArticles';
import { useAuth } from '@/hooks/useAuth';
import { Edit, Eye } from 'lucide-react';

const CMSArticlesList = () => {
const router = useRouter();
  const { user } = useAuth();
  const { articles, loading } = useAllArticles();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const canEditArticle = (authorId: string) => {
    return user?.id === authorId;
  };

  if (loading) {
    return <div className="p-4 animate-pulse">Loading articles...</div>;
  }

  return (
    <div className="p-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Views</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.map((article) => (
            <TableRow key={article.id}>
              <TableCell>
                <div>
                  <p className="font-medium truncate max-w-xs">{article.title}</p>
                  {article.excerpt && (
                    <p className="text-sm text-gray-500 truncate max-w-xs">
                      {article.excerpt}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{article.author?.name || 'Unknown Author'}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs">
                  {article.category?.name || 'Uncategorized'}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={`text-xs ${getStatusColor(article.status)}`}>
                  {article.status}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-sm text-gray-600">{article.views}</span>
              </TableCell>
              <TableCell>
                <span className="text-sm text-gray-500">
                  {new Date(article.created_at).toLocaleDateString()}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  {article.status === 'published' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(`/news/${article.slug}`, '_blank')}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  {canEditArticle(article.author_id) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/cms/articles/edit/${article.id}`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  {!canEditArticle(article.author_id) && (
                    <span className="text-xs text-gray-400 px-2">
                      View only
                    </span>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CMSArticlesList;
