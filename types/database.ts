export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type MemberRole = "admin" | "member";

export type ReactionType =
  | "LIKE"
  | "AGREE"
  | "INSIGHT"
  | "MIND_BLOWN"
  | "ANGRY"
  | "LOVE";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string;
          avatar_url: string | null;
          bio: string | null;
          favorite_book: string | null;
          favorite_genres: string[];
          created_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name: string;
          avatar_url?: string | null;
          bio?: string | null;
          favorite_book?: string | null;
          favorite_genres?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          display_name?: string;
          avatar_url?: string | null;
          bio?: string | null;
          favorite_book?: string | null;
          favorite_genres?: string[];
          created_at?: string;
        };
        Relationships: [];
      };
      reading_groups: {
        Row: {
          id: string;
          title: string;
          book_title: string;
          book_author: string;
          book_cover_url: string | null;
          is_private: boolean;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          book_title: string;
          book_author: string;
          book_cover_url?: string | null;
          is_private?: boolean;
          created_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          book_title?: string;
          book_author?: string;
          book_cover_url?: string | null;
          is_private?: boolean;
          created_by?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reading_groups_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      group_members: {
        Row: {
          group_id: string;
          user_id: string;
          role: MemberRole;
          joined_at: string;
        };
        Insert: {
          group_id: string;
          user_id: string;
          role?: MemberRole;
          joined_at?: string;
        };
        Update: {
          group_id?: string;
          user_id?: string;
          role?: MemberRole;
          joined_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey";
            columns: ["group_id"];
            isOneToOne: false;
            referencedRelation: "reading_groups";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "group_members_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      milestones: {
        Row: {
          id: string;
          group_id: string;
          title: string | null;
          target_chapter: number | null;
          target_page: number | null;
          due_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          title?: string | null;
          target_chapter?: number | null;
          target_page?: number | null;
          due_date: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          group_id?: string;
          title?: string | null;
          target_chapter?: number | null;
          target_page?: number | null;
          due_date?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "milestones_group_id_fkey";
            columns: ["group_id"];
            isOneToOne: false;
            referencedRelation: "reading_groups";
            referencedColumns: ["id"];
          }
        ];
      };
      user_progress: {
        Row: {
          id: string;
          group_id: string;
          user_id: string;
          current_page: number;
          current_chapter: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          user_id: string;
          current_page?: number;
          current_chapter?: number;
          updated_at?: string;
        };
        Update: {
          id?: string;
          group_id?: string;
          user_id?: string;
          current_page?: number;
          current_chapter?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_progress_group_id_fkey";
            columns: ["group_id"];
            isOneToOne: false;
            referencedRelation: "reading_groups";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_progress_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      comments: {
        Row: {
          id: string;
          group_id: string;
          user_id: string;
          parent_id: string | null;
          chapter_ref: number | null;
          page_ref: number | null;
          content: string;
          has_spoiler: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          user_id: string;
          parent_id?: string | null;
          chapter_ref?: number | null;
          page_ref?: number | null;
          content: string;
          has_spoiler?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          group_id?: string;
          user_id?: string;
          parent_id?: string | null;
          chapter_ref?: number | null;
          page_ref?: number | null;
          content?: string;
          has_spoiler?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "comments_group_id_fkey";
            columns: ["group_id"];
            isOneToOne: false;
            referencedRelation: "reading_groups";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "comments_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      reactions: {
        Row: {
          id: string;
          comment_id: string;
          user_id: string;
          reaction_type: ReactionType;
          created_at: string;
        };
        Insert: {
          id?: string;
          comment_id: string;
          user_id: string;
          reaction_type: ReactionType;
          created_at?: string;
        };
        Update: {
          id?: string;
          comment_id?: string;
          user_id?: string;
          reaction_type?: ReactionType;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reactions_comment_id_fkey";
            columns: ["comment_id"];
            isOneToOne: false;
            referencedRelation: "comments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reactions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      member_role: MemberRole;
      reaction_type: ReactionType;
    };
    CompositeTypes: Record<string, never>;
  };
}

// Modelos tipados convenientes para componentes e Server Actions
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ReadingGroup = Database["public"]["Tables"]["reading_groups"]["Row"];
export type GroupMember = Database["public"]["Tables"]["group_members"]["Row"];
export type Milestone = Database["public"]["Tables"]["milestones"]["Row"];
export type UserProgress = Database["public"]["Tables"]["user_progress"]["Row"];
export type Comment = Database["public"]["Tables"]["comments"]["Row"];
export type Reaction = Database["public"]["Tables"]["reactions"]["Row"];
