
interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  trending: boolean;
  views: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  author_id: string;
  category_id: string;
  meta_title?: string;
  meta_description?: string;
  keywords?: string[];
  category: {
    id: string;
    name: string;
    color: string;
    slug: string;
    description?: string;
    icon?: string;
  } | null;
  author: {
    id: string;
    name: string;
    bio?: string;
    avatar?: string;
    title?: string;
  } | null;
}

export const filterArticles = (
  articles: Article[],
  searchTerm: string,
  statusFilter: string
): Article[] => {
  return articles.filter(article => {
    const matchesSearch = searchTerm === '' || 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (article.author?.name && article.author.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || article.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
};
