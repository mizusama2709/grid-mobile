export type UserRole = 'freelancer' | 'client';
export type JobStatus = 'open' | 'closed';
export type ApplicationStatus = 'pending' | 'accepted' | 'rejected';
export type RateType = 'fixed' | 'hourly' | 'per-day';
export type BookingStatus = 'requested' | 'confirmed' | 'declined';

export interface UserDoc {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  phone?: string;
  created_at: number;
  // freelancer-only
  bio?: string;
  categories?: string[];
  location?: string;
  portfolio_links?: string[];
  avatar_url?: string;
  // client-only
  display_name?: string;
}

export interface JobDoc {
  id: string;
  client_id: string;
  title: string;
  description: string;
  category: string;
  budget_min?: number;
  budget_max?: number;
  timeline?: string;
  status: JobStatus;
  created_at: number;
}

export interface JobApplicationDoc {
  id: string;
  job_id: string;
  freelancer_id: string;
  message?: string;
  status: ApplicationStatus;
  created_at: number;
}

export interface GigDoc {
  id: string;
  freelancer_id: string;
  title: string;
  description: string;
  category: string;
  rate: number;
  rate_type: RateType;
  created_at: number;
}

export interface BookingDoc {
  id: string;
  gig_id: string;
  client_id: string;
  message?: string;
  status: BookingStatus;
  created_at: number;
}
