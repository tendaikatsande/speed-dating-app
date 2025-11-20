export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string
          bio: string | null
          avatar_url: string | null
          date_of_birth: string
          gender: string
          interests: string[]
          looking_for: string[]
          location: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name: string
          bio?: string | null
          avatar_url?: string | null
          date_of_birth: string
          gender: string
          interests?: string[]
          looking_for?: string[]
          location?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string
          bio?: string | null
          avatar_url?: string | null
          date_of_birth?: string
          gender?: string
          interests?: string[]
          looking_for?: string[]
          location?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string
          date: string
          time: string
          location: string
          capacity: number
          registered_count: number
          price: number
          image_url: string | null
          organizer_id: string
          status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          date: string
          time: string
          location: string
          capacity: number
          registered_count?: number
          price: number
          image_url?: string | null
          organizer_id: string
          status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          date?: string
          time?: string
          location?: string
          capacity?: number
          registered_count?: number
          price?: number
          image_url?: string | null
          organizer_id?: string
          status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
      }
      registrations: {
        Row: {
          id: string
          user_id: string
          event_id: string
          status: 'registered' | 'checked_in' | 'cancelled'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          event_id: string
          status?: 'registered' | 'checked_in' | 'cancelled'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          event_id?: string
          status?: 'registered' | 'checked_in' | 'cancelled'
          created_at?: string
        }
      }
      matches: {
        Row: {
          id: string
          event_id: string
          user_id_1: string
          user_id_2: string
          status: 'pending' | 'mutual' | 'declined'
          user_1_interested: boolean
          user_2_interested: boolean
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          user_id_1: string
          user_id_2: string
          status?: 'pending' | 'mutual' | 'declined'
          user_1_interested?: boolean
          user_2_interested?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          user_id_1?: string
          user_id_2?: string
          status?: 'pending' | 'mutual' | 'declined'
          user_1_interested?: boolean
          user_2_interested?: boolean
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          match_id: string
          sender_id: string
          content: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          match_id: string
          sender_id: string
          content: string
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          match_id?: string
          sender_id?: string
          content?: string
          read?: boolean
          created_at?: string
        }
      }
      ratings: {
        Row: {
          id: string
          event_id: string
          user_id: string
          rating: number
          review: string | null
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          user_id: string
          rating: number
          review?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string
          rating?: number
          review?: string | null
          created_at?: string
        }
      }
    }
  }
}
