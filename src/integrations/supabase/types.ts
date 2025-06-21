export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      article_tags: {
        Row: {
          article_id: string
          id: string
          tag_id: string
        }
        Insert: {
          article_id: string
          id?: string
          tag_id: string
        }
        Update: {
          article_id?: string
          id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_tags_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_tags_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles_with_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      articles: {
        Row: {
          author_id: string
          category_id: string
          content: string
          created_at: string
          excerpt: string | null
          featured: boolean
          featured_image: string | null
          id: string
          keywords: string[] | null
          meta_description: string | null
          meta_title: string | null
          published_at: string | null
          read_time: number
          slug: string
          status: Database["public"]["Enums"]["article_status"]
          title: string
          trending: boolean
          updated_at: string
          views: number
        }
        Insert: {
          author_id: string
          category_id: string
          content: string
          created_at?: string
          excerpt?: string | null
          featured?: boolean
          featured_image?: string | null
          id?: string
          keywords?: string[] | null
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          read_time?: number
          slug: string
          status?: Database["public"]["Enums"]["article_status"]
          title: string
          trending?: boolean
          updated_at?: string
          views?: number
        }
        Update: {
          author_id?: string
          category_id?: string
          content?: string
          created_at?: string
          excerpt?: string | null
          featured?: boolean
          featured_image?: string | null
          id?: string
          keywords?: string[] | null
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          read_time?: number
          slug?: string
          status?: Database["public"]["Enums"]["article_status"]
          title?: string
          trending?: boolean
          updated_at?: string
          views?: number
        }
        Relationships: [
          {
            foreignKeyName: "articles_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          color: string
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          color?: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          approved: boolean
          article_id: string
          author_name: string
          content: string
          created_at: string
          id: string
          parent_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          approved?: boolean
          article_id: string
          author_name: string
          content: string
          created_at?: string
          id?: string
          parent_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          approved?: boolean
          article_id?: string
          author_name?: string
          content?: string
          created_at?: string
          id?: string
          parent_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles_with_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar: string | null
          bio: string | null
          created_at: string
          email_verified: boolean | null
          facebook: string | null
          id: string
          linkedin: string | null
          name: string
          title: string | null
          twitter: string | null
          updated_at: string
        }
        Insert: {
          avatar?: string | null
          bio?: string | null
          created_at?: string
          email_verified?: boolean | null
          facebook?: string | null
          id: string
          linkedin?: string | null
          name: string
          title?: string | null
          twitter?: string | null
          updated_at?: string
        }
        Update: {
          avatar?: string | null
          bio?: string | null
          created_at?: string
          email_verified?: boolean | null
          facebook?: string | null
          id?: string
          linkedin?: string | null
          name?: string
          title?: string | null
          twitter?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reactions: {
        Row: {
          article_id: string
          created_at: string
          id: string
          session_id: string | null
          type: Database["public"]["Enums"]["reaction_type"]
          user_id: string | null
        }
        Insert: {
          article_id: string
          created_at?: string
          id?: string
          session_id?: string | null
          type: Database["public"]["Enums"]["reaction_type"]
          user_id?: string | null
        }
        Update: {
          article_id?: string
          created_at?: string
          id?: string
          session_id?: string | null
          type?: Database["public"]["Enums"]["reaction_type"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reactions_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reactions_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles_with_details"
            referencedColumns: ["id"]
          },
        ]
      }
      social_media_accounts: {
        Row: {
          created_at: string
          followers_count: number
          handle: string
          id: string
          platform: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          followers_count?: number
          handle: string
          id?: string
          platform: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          followers_count?: number
          handle?: string
          id?: string
          platform?: string
          updated_at?: string
        }
        Relationships: []
      }
      social_media_posts: {
        Row: {
          account_id: string
          content: string
          created_at: string
          engagement: string | null
          id: string
          posted_at: string
        }
        Insert: {
          account_id: string
          content: string
          created_at?: string
          engagement?: string | null
          id?: string
          posted_at?: string
        }
        Update: {
          account_id?: string
          content?: string
          created_at?: string
          engagement?: string | null
          id?: string
          posted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_media_posts_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "social_media_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      article_reactions_summary: {
        Row: {
          angry: number | null
          article_id: string | null
          hearts: number | null
          laughs: number | null
          likes: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reactions_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reactions_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles_with_details"
            referencedColumns: ["id"]
          },
        ]
      }
      articles_with_details: {
        Row: {
          author_avatar: string | null
          author_id: string | null
          author_name: string | null
          category_color: string | null
          category_icon: string | null
          category_id: string | null
          category_name: string | null
          content: string | null
          created_at: string | null
          excerpt: string | null
          featured: boolean | null
          featured_image: string | null
          id: string | null
          keywords: string[] | null
          meta_description: string | null
          meta_title: string | null
          published_at: string | null
          read_time: number | null
          slug: string | null
          status: Database["public"]["Enums"]["article_status"] | null
          tag_names: string[] | null
          title: string | null
          trending: boolean | null
          updated_at: string | null
          views: number | null
        }
        Relationships: [
          {
            foreignKeyName: "articles_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      admin_create_user: {
        Args: {
          user_email: string
          user_password: string
          user_name: string
          user_role?: Database["public"]["Enums"]["user_role"]
          user_bio?: string
          user_title?: string
          user_avatar?: string
        }
        Returns: Json
      }
      get_article_comments: {
        Args: { article_uuid: string }
        Returns: {
          id: string
          content: string
          author_name: string
          created_at: string
          parent_id: string
          replies_count: number
        }[]
      }
      get_article_reactions: {
        Args: { article_uuid: string }
        Returns: {
          likes: number
          hearts: number
          laughs: number
          angry: number
        }[]
      }
      get_social_media_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          platform: string
          handle: string
          followers_count: number
          recent_posts_count: number
        }[]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
      increment_article_views: {
        Args: { article_slug: string }
        Returns: undefined
      }
    }
    Enums: {
      article_status: "draft" | "published" | "archived"
      reaction_type: "like" | "heart" | "laugh" | "angry"
      user_role: "admin" | "editor" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      article_status: ["draft", "published", "archived"],
      reaction_type: ["like", "heart", "laugh", "angry"],
      user_role: ["admin", "editor", "moderator", "user"],
    },
  },
} as const
