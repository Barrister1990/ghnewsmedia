import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminArticle } from '@/types/news';
import { Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface ArticleCardsProps {
  articles: AdminArticle[];
  onUpdateStatus: (articleId: string, newStatus: 'draft' | 'published' | 'archived') => void;
  onToggleFeatured: (articleId: string, currentFeatured: boolean) => void;
  onToggleTrending: (articleId: string, currentTrending: boolean) => void;
  onDelete: (articleId: string) => void;
}

const ArticleCards = ({
  articles,
  onUpdateStatus,
  onToggleFeatured,
  onToggleTrending,
  onDelete
}: ArticleCardsProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {articles.map((article) => (
        <Card key={article.id}>
          <CardHeader>
            <CardTitle>{article.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              <Badge className={getStatusColor(article.status)}>
                {article.status}
              </Badge>
              {article.featured && <Badge variant="secondary">Featured</Badge>}
              {article.trending && <Badge variant="secondary">Trending</Badge>}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href={`/admin/articles/edit/${article.id}`}>
              <Button size="sm" variant="outline">
                <Edit className="w-4 h-4" />
              </Button>
            </Link>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete(article.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ArticleCards;
