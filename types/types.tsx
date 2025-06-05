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

export const ticketFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  details: z.string().min(5, "Description must be at least 5 characters"),
  ticketCategory: z.string().min(1, "Category is required"),
  name: z.string().min(1, "Name is required"),
  mobileNumber: z.string().min(10, "Mobile number must be at least 10 digits"),
  countryCode: z.string(),
  attachments: z
    .array(z.object({ file: z.instanceof(File) }))
    .max(5, "Maximum 5 files allowed")
    .optional(),
});

export type TicketFormValues = z.infer<typeof ticketFormSchema>;

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
  message: string;
  status: 'sent' | 'delivered' | 'read' | 'failed' | 'pending' | 'scheduled';
  date: Date;
}