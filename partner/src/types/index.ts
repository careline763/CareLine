export type JobStatus = 'confirmed' | 'assigned' | 'en_route' | 'started' | 'completed' | 'cancelled';

export interface User {
  id: number;
  name: string;
  phone: string;
  email?: string;
  role: string;
}

export interface Partner {
  id: number;
  user_id: number;
  verification_status: 'pending' | 'approved' | 'rejected';
  verified: boolean;
  rating: number;
  rating_avg: number;
  total_jobs: number;
  is_available: boolean;
  status: 'active' | 'inactive' | 'suspended';
}

export interface Vehicle {
  type: string;
  model: string;
  plate_number: string;
}

export interface Plan {
  id: number;
  name: string;
  type: string;
  includes_json: string[];
}

export interface Job {
  id: number;
  user_id: number;
  address: string;
  pincode: string;
  scheduled_at: string;
  status: JobStatus;
  total_amount: number;
  extras_json?: number[];
  before_photo_url?: string;
  after_photo_url?: string;
  notes?: string;
  customer: { name: string; phone: string };
  vehicle: Vehicle;
  plan: Plan;
}

export interface EarningDay {
  date: string;
  jobs: number;
  amount: number;
}
