import { JSX } from "react";

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
  current_page: number;
  total_pages: number;
  total_items: number;
  items_per_page: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
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
  access_token: string;
  order_number: number;
  admin:Admin;
}
export interface TicketType {
  id?: string;
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

export interface WhatsappMessage {
  id: string;
  order_number: number;
  phone_number: string;
  message: string;
  status: 'sent' | 'delivered' | 'read' | 'failed' | 'pending' | 'scheduled';
  date: Date;
}