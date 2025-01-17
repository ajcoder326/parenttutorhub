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
      matches: {
        Row: {
          created_at: string
          id: string
          request_id: string | null
          status: string | null
          tutor_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          request_id?: string | null
          status?: string | null
          tutor_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          request_id?: string | null
          status?: string | null
          tutor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "parent_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_tutor_id_fkey"
            columns: ["tutor_id"]
            isOneToOne: false
            referencedRelation: "tutor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      parent_requests: {
        Row: {
          budget_max: number | null
          budget_min: number | null
          created_at: string
          grade_level: string
          id: string
          location: string | null
          parent_id: string | null
          requirements: string | null
          status: string | null
          subjects: string[] | null
        }
        Insert: {
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string
          grade_level: string
          id?: string
          location?: string | null
          parent_id?: string | null
          requirements?: string | null
          status?: string | null
          subjects?: string[] | null
        }
        Update: {
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string
          grade_level?: string
          id?: string
          location?: string | null
          parent_id?: string | null
          requirements?: string | null
          status?: string | null
          subjects?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "parent_requests_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          location: string | null
          phone: string | null
          role: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          location?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          location?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      tutor_profiles: {
        Row: {
          bio: string | null
          created_at: string
          hourly_rate: number | null
          id: string
          qualifications: string[] | null
          subjects: string[] | null
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          hourly_rate?: number | null
          id: string
          qualifications?: string[] | null
          subjects?: string[] | null
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          hourly_rate?: number | null
          id?: string
          qualifications?: string[] | null
          subjects?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tutor_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
