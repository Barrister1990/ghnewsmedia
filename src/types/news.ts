
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
  updated_at: string;
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
export type RawArticle = {
  id: string;
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  author_id?: string;
  author_name?: string;
  author_avatar?: string;
  category_id?: string;
  category_name?: string;
  category_color?: string;
  category_icon?: string;
  tag_names?: string[];
  published_at?: string;
  created_at?: string;
  updated_at?: string;
  read_time?: number;
  views?: number;
  featured?: boolean;
  trending?: boolean;
  status?: string;
};

