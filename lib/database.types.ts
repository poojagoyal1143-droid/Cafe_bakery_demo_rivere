/**
 * Riverè Cafe & Bakery - Strictly Typed Database Schema Interface
 * File: lib/database.types.ts
 * Description: 100% Type-safe Supabase Database mappings, ENUMs, and Entity types.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type MenuCategoryEnum =
  | 'viennoiserie'
  | 'patisserie'
  | 'breads'
  | 'beverages'
  | 'seasonal';

export type RecipeDifficultyEnum =
  | 'easy'
  | 'artisan'
  | 'master_baker';

export type ReservationStatusEnum =
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'completed';

export interface RecipeIngredient {
  item: string;
  quantity: number;
  unit: string;
}

export interface RecipeInstruction {
  step_number: number;
  title: string;
  detail: string;
}

export interface Database {
  public: {
    Tables: {
      menu_items: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          title: string;
          slug: string;
          category: MenuCategoryEnum;
          description: string;
          price: number;
          image_url: string;
          page_number: number;
          display_order: number;
          allergens: string[];
          is_available: boolean;
          is_featured: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title: string;
          slug: string;
          category: MenuCategoryEnum;
          description: string;
          price: number;
          image_url: string;
          page_number: number;
          display_order?: number;
          allergens?: string[];
          is_available?: boolean;
          is_featured?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title?: string;
          slug?: string;
          category?: MenuCategoryEnum;
          description?: string;
          price?: number;
          image_url?: string;
          page_number?: number;
          display_order?: number;
          allergens?: string[];
          is_available?: boolean;
          is_featured?: boolean;
        };
        Relationships: [];
      };

      recipes: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          title: string;
          slug: string;
          excerpt: string;
          prep_time_minutes: number;
          bake_time_minutes: number;
          yield_servings: number;
          difficulty: RecipeDifficultyEnum;
          ingredients: RecipeIngredient[] | Json;
          instructions: RecipeInstruction[] | Json;
          image_url: string;
          is_published: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title: string;
          slug: string;
          excerpt: string;
          prep_time_minutes: number;
          bake_time_minutes: number;
          yield_servings: number;
          difficulty?: RecipeDifficultyEnum;
          ingredients: RecipeIngredient[] | Json;
          instructions: RecipeInstruction[] | Json;
          image_url: string;
          is_published?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title?: string;
          slug?: string;
          excerpt?: string;
          prep_time_minutes?: number;
          bake_time_minutes?: number;
          yield_servings?: number;
          difficulty?: RecipeDifficultyEnum;
          ingredients?: RecipeIngredient[] | Json;
          instructions?: RecipeInstruction[] | Json;
          image_url?: string;
          is_published?: boolean;
        };
        Relationships: [];
      };

      tables_layout: {
        Row: {
          id: string;
          table_number: number;
          capacity: number;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          table_number: number;
          capacity: number;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          table_number?: number;
          capacity?: number;
          is_active?: boolean;
        };
        Relationships: [];
      };

      reservations: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          reservation_date: string;
          reservation_time: string;
          party_size: number;
          table_id: string | null;
          special_requests: string | null;
          status: ReservationStatusEnum;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          reservation_date: string;
          reservation_time: string;
          party_size: number;
          table_id?: string | null;
          special_requests?: string | null;
          status?: ReservationStatusEnum;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          customer_name?: string;
          customer_email?: string;
          customer_phone?: string;
          reservation_date?: string;
          reservation_time?: string;
          party_size?: number;
          table_id?: string | null;
          special_requests?: string | null;
          status?: ReservationStatusEnum;
        };
        Relationships: [
          {
            foreignKeyName: "reservations_table_id_fkey";
            columns: ["table_id"];
            referencedRelation: "tables_layout";
            referencedColumns: ["id"];
          }
        ];
      };

      audit_logs: {
        Row: {
          id: number;
          table_name: string;
          operation: string;
          record_id: string;
          old_data: Json | null;
          new_data: Json | null;
          executed_at: string;
        };
        Insert: {
          id?: number;
          table_name: string;
          operation: string;
          record_id: string;
          old_data?: Json | null;
          new_data?: Json | null;
          executed_at?: string;
        };
        Update: {
          id?: number;
          table_name?: string;
          operation?: string;
          record_id?: string;
          old_data?: Json | null;
          new_data?: Json | null;
          executed_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      check_reservation_rate_limit: {
        Args: {
          p_email: string;
          p_date: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      menu_category_enum: MenuCategoryEnum;
      recipe_difficulty_enum: RecipeDifficultyEnum;
      reservation_status_enum: ReservationStatusEnum;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// Convenience helper aliases for domain model usages
export type MenuItem = Database['public']['Tables']['menu_items']['Row'];
export type MenuItemInsert = Database['public']['Tables']['menu_items']['Insert'];
export type MenuItemUpdate = Database['public']['Tables']['menu_items']['Update'];

export type Recipe = Database['public']['Tables']['recipes']['Row'];
export type RecipeInsert = Database['public']['Tables']['recipes']['Insert'];
export type RecipeUpdate = Database['public']['Tables']['recipes']['Update'];

export type TableLayout = Database['public']['Tables']['tables_layout']['Row'];
export type TableLayoutInsert = Database['public']['Tables']['tables_layout']['Insert'];
export type TableLayoutUpdate = Database['public']['Tables']['tables_layout']['Update'];

export type Reservation = Database['public']['Tables']['reservations']['Row'];
export type ReservationInsert = Database['public']['Tables']['reservations']['Insert'];
export type ReservationUpdate = Database['public']['Tables']['reservations']['Update'];

export type AuditLog = Database['public']['Tables']['audit_logs']['Row'];
