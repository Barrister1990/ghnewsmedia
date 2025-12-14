
import { formatDate } from '@/components/NewsCard/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    TableRow
} from '@/components/ui/table';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAllArticles } from '@/hooks/useAllArticles';
import { Edit, Eye, MoreHorizontal, Trash2 } from 'lucide-react';
import Link from 'next/link';

const ArticlesList = () => {
  const { 
    articles, 
    loading, 
    error, 
    deleteArticle, 
    updateArticleStatus, 
    toggleFeatured 
  } = useAllArticles();
  const isMobile = useIsMobile();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p className="font-medium">Error loading articles</p>
            <p className="text-sm">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
              variant="outline"
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (articles.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <p className="font-medium">No articles found</p>
            <p className="text-sm">Create your first article to get started</p>
            <Link href="/admin/articles/create">
              <Button className="mt-4">Create Article</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Mobile card view
  if (isMobile) {
    return (
      <div className="space-y-4 p-4">
        <h3 className="text-lg font-semibold">All Articles ({articles.length})</h3>
        {articles.map((article) => (
          <Card key={article.id} className="p-4">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-sm line-clamp-2 flex-1 mr-2">
                  {article.title}
                </h4>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/articles/edit/${article.id}`} className="w-full">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={article.category ? `/${article.category.slug}/${article.slug}` : '#'} target="_blank" className="w-full">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {article.status === 'draft' && (
                      <DropdownMenuItem
                        onClick={() => updateArticleStatus(article.id, 'published')}
                      >
                        Publish
                      </DropdownMenuItem>
                    )}
                    {article.status === 'published' && (
                      <DropdownMenuItem
                        onClick={() => updateArticleStatus(article.id, 'draft')}
                      >
                        Unpublish
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => toggleFeatured(article.id, article.featured)}
                    >
                      {article.featured ? 'Unfeature' : 'Feature'}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => deleteArticle(article.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="text-gray-600">
                  By {article.author?.name || 'Unknown Author'}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">
                  {formatDate(article.published_at || article.created_at)}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">
                  {article.views.toLocaleString()} views
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge className={getStatusColor(article.status)}>
                  {article.status}
                </Badge>
                {article.category && (
                  <Badge style={{ backgroundColor: article.category.color }}>
                    {article.category.name}
                  </Badge>
                )}
                {article.featured && (
                  <Badge variant="secondary">Featured</Badge>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  // Desktop table view
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Articles ({articles.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">Title</TableHead>
                <TableHead className="min-w-[120px]">Author</TableHead>
                <TableHead className="min-w-[100px]">Category</TableHead>
                <TableHead className="min-w-[80px]">Status</TableHead>
                <TableHead className="min-w-[80px]">Featured</TableHead>
                <TableHead className="min-w-[80px]">Views</TableHead>
                <TableHead className="min-w-[100px]">Date</TableHead>
                <TableHead className="min-w-[200px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="font-medium">
                    <div className="max-w-xs truncate" title={article.title}>
                      {article.title}
                    </div>
                  </TableCell>
                  <TableCell>{article.author?.name || 'Unknown Author'}</TableCell>
                  <TableCell>
                    {article.category ? (
                      <Badge style={{ backgroundColor: article.category.color }}>
                        {article.category.name}
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Uncategorized</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(article.status)}>
                      {article.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {article.featured && <Badge variant="secondary">Featured</Badge>}
                  </TableCell>
                  <TableCell>{article.views.toLocaleString()}</TableCell>
                  <TableCell>
                    {formatDate(article.published_at || article.created_at)}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Link href={`/admin/articles/edit/${article.id}`}>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      
                      <Link href={`/article/${article.slug}`} target="_blank">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      
                      {article.status === 'draft' && (
                        <Button
                          size="sm"
                          onClick={() => updateArticleStatus(article.id, 'published')}
                          className="text-xs px-2"
                        >
                          Publish
                        </Button>
                      )}
                      
                      {article.status === 'published' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateArticleStatus(article.id, 'draft')}
                          className="text-xs px-2"
                        >
                          Unpublish
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleFeatured(article.id, article.featured)}
                        className="text-xs px-2"
                      >
                        {article.featured ? 'Unfeature' : 'Feature'}
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteArticle(article.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArticlesList;
