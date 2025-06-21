
import { formatDate } from '@/components/NewsCard/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Article {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  trending: boolean;
  views: number;
  published_at: string | null;
  created_at: string;
  author_id: string;
  category: {
    name: string;
    color: string;
  } | null;
  profiles: {
    name: string;
  } | null;
}

interface ArticleTableProps {
  articles: Article[];
  onUpdateStatus: (articleId: string, newStatus: 'draft' | 'published' | 'archived') => void;
  onToggleFeatured: (articleId: string, currentFeatured: boolean) => void;
  onDelete: (articleId: string) => void;
}

const ArticleTable = ({ 
  articles, 
  onUpdateStatus, 
  onToggleFeatured, 
  onDelete 
}: ArticleTableProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Articles ({articles.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.map((article) => (
              <TableRow key={article.id}>
                <TableCell className="font-medium">{article.title}</TableCell>
                <TableCell>{article.profiles?.name || 'Unknown Author'}</TableCell>
                <TableCell>
                  <Badge style={{ backgroundColor: article.category?.color || '#3B82F6' }}>
                    {article.category?.name || 'Uncategorized'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(article.status)}>
                    {article.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {article.featured && <Badge variant="secondary">Featured</Badge>}
                </TableCell>
                <TableCell>{article.views}</TableCell>
                <TableCell>
                  {formatDate(article.published_at || article.created_at)}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Link href={`/admin/articles/edit/${article.id}`}>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    {article.status === 'draft' && (
                      <Button
                        size="sm"
                        onClick={() => onUpdateStatus(article.id, 'published')}
                      >
                        Publish
                      </Button>
                    )}
                    {article.status === 'published' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onUpdateStatus(article.id, 'draft')}
                      >
                        Unpublish
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onToggleFeatured(article.id, article.featured)}
                    >
                      {article.featured ? 'Unfeature' : 'Feature'}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onDelete(article.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ArticleTable;
