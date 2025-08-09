
import { AdminArticle } from "@/types/news";

export const filterArticles = (
  articles: AdminArticle[],
  searchTerm: string,
  statusFilter: string,
  trendingFilter: boolean | null
): AdminArticle[] => {
  return articles.filter(article => {
    const matchesSearch = searchTerm === '' || 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (article.author?.name && article.author.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || article.status === statusFilter;

    const matchesTrending = trendingFilter === null || article.trending === trendingFilter;
    
    return matchesSearch && matchesStatus && matchesTrending;
  });
};
