export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      contact_messages: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          message: string;
          name: string;
          status: Database['public']['Enums']['message_status'];
          subject: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          message: string;
          name: string;
          status?: Database['public']['Enums']['message_status'];
          subject: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          message?: string;
          name?: string;
          status?: Database['public']['Enums']['message_status'];
          subject?: string;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          address: string | null;
          created_at: string;
          email: string | null;
          id: string;
          items: Json;
          name: string;
          order_type: 'dine-in' | 'takeaway' | 'delivery';
          phone: string;
          razorpay_order_id: string;
          razorpay_payment_id: string;
          status: Database['public']['Enums']['order_status'];
          total: number;
        };
        Insert: {
          address?: string | null;
          created_at?: string;
          email?: string | null;
          id?: string;
          items: Json;
          name: string;
          order_type: 'dine-in' | 'takeaway' | 'delivery';
          phone: string;
          razorpay_order_id: string;
          razorpay_payment_id: string;
          status?: Database['public']['Enums']['order_status'];
          total: number;
        };
        Update: {
          address?: string | null;
          created_at?: string;
          email?: string | null;
          id?: string;
          items?: Json;
          name?: string;
          order_type?: 'dine-in' | 'takeaway' | 'delivery';
          phone?: string;
          razorpay_order_id?: string;
          razorpay_payment_id?: string;
          status?: Database['public']['Enums']['order_status'];
          total?: number;
        };
        Relationships: [];
      };
      reservations: {
        Row: {
          created_at: string;
          date: string;
          email: string | null;
          id: string;
          name: string;
          party_size: number;
          phone: string;
          special_requests: string | null;
          status: Database['public']['Enums']['reservation_status'];
          time: string;
        };
        Insert: {
          created_at?: string;
          date: string;
          email?: string | null;
          id?: string;
          name: string;
          party_size: number;
          phone: string;
          special_requests?: string | null;
          status?: Database['public']['Enums']['reservation_status'];
          time: string;
        };
        Update: {
          created_at?: string;
          date?: string;
          email?: string | null;
          id?: string;
          name?: string;
          party_size?: number;
          phone?: string;
          special_requests?: string | null;
          status?: Database['public']['Enums']['reservation_status'];
          time?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: {
      message_status: 'unread' | 'read' | 'replied';
      order_status: 'paid' | 'preparing' | 'ready' | 'out_for_delivery' | 'completed' | 'cancelled';
      reservation_status: 'pending' | 'confirmed' | 'cancelled' | 'no_show';
    };
    CompositeTypes: Record<never, never>;
  };
};

export type Reservation = Database['public']['Tables']['reservations']['Row'];
export type ReservationInsert = Database['public']['Tables']['reservations']['Insert'];
export type ReservationStatus = Database['public']['Enums']['reservation_status'];

export type ContactMessage = Database['public']['Tables']['contact_messages']['Row'];
export type ContactMessageInsert = Database['public']['Tables']['contact_messages']['Insert'];
export type MessageStatus = Database['public']['Enums']['message_status'];

export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderInsert = Database['public']['Tables']['orders']['Insert'];
export type OrderStatus = Database['public']['Enums']['order_status'];
