import { JSX } from "react";
import { z } from "zod";

export type Column = {
  id: string;
  accessorKey: string;
  header: string;
  cell?: ({ row }: { row: any }) => JSX.Element | string;
};


export interface ApiError {
  message: string;
  status?: number;
  details?: any;
}

export interface Tenants {
  id: string;
  subdomain: boolean;
  company_name: string;
  admin_email: string;
  admin_name: string;
  phone: string;
  order_number:number
}

export interface Pagination {
  
  total_pages?: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface Contact {
  order_number: number;
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  tags: string[];
  notes: string;
  custom_fields: Record<string, string>;
}

export interface Admin {
  id: string;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  role: string;
  status: string;
  phone_number: string;
  job_title: string;
  last_login_at: string;
  expires_in: number;
}

export interface User {
   id: string;
  first_name: string;
  last_name: string;
  email: string;
  role:string;
  status:string;
  access_token: string;
  order_number: number;
  admin:Admin;
}
export interface TicketType {
  id: string;
  subject: string;
  description: string;
  priority: string;
  assigned_to: string;
  category: string;
  userId: string;
  assigned_admin?: User;
  due_date?: Date;
  contact?: Contact;
  contact_name:string
  contact_phone:string
  status:string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

export interface TicketCategoryType {
  id: string;
  name: string;
  details: string;
}

export interface TicketType {
 
  title: string;
  details: string;
  status: string;
  priority: string;
  assignedToId: string;
  product: string;
  ticketCategoryId: string;
  userId: string;
  assignedToUser?: User;
  dueDate?: Date;
  contact?: Contact;
  createdAt: Date;
  updatedAt: Date;
}

export const ticketSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  description: z.string().min(10, "Description is required"),
  priority: z.string().optional(),
  category: z.string().optional(),
  status: z.string().optional(),
  assigned_to: z.string().optional(),
  due_date: z.date().optional(),
  contact_id: z.string().optional(),
});

export type TicketValues = z.infer<typeof ticketSchema>;

export interface Comment {
  id: string;
  ticket_id: string;
  user_id: string;
  message: string;
  is_internal: boolean;
  attachments: string[] | null;
  sender_name: string | null;
  sender_email: string | null;
  created_at: string;
  user: User;
}

export interface WhatsappMessage {
  id: string;
  order_number: number;
  phone_number: string;
  content: string;
  messages: Messages[];
  status: 'sent' | 'delivered' | 'read' | 'failed' | 'pending' | 'scheduled';
  date: Date;
}

export interface Messages {
  direction: string;
  content: string;
  created_at:Date
  phone_number: string;
  sent_by_admin_id: string;
  status: 'sent' | 'delivered' | 'read' | 'failed' | 'pending' | 'scheduled';
}