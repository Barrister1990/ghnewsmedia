
export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: Author;
  category: Category;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  readTime: number;
  views: number;
  reactions: {
    likes: number;
    hearts: number;
    laughs: number;
    angry: number;
  };
  comments: Comment[];
  featured: boolean;
  trending: boolean;
}

export interface Author {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  title: string;
  social: {
    twitter?: string;
    facebook?: string;
    linkedin?: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  replies?: Comment[];
}

export interface ReactionType {
  type: 'like' | 'heart' | 'laugh' | 'angry';
  emoji: string;
  label: string;
}
