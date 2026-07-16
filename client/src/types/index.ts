export type UserRole = 'customer' | 'partner' | 'admin';

export interface User {
  id: number;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
}

export interface Vehicle {
  id: number;
  user_id: number;
  type: 'hatchback' | 'sedan' | 'suv' | 'muv' | 'luxury';
  model: string;
  plate_number: string;
}

export interface Plan {
  id: number;
  name: string;
  type: 'one_time' | 'weekly' | 'monthly' | 'society';
  price: number;
  frequency: string;
  includes_json: string[];
  popular?: boolean;
}

export interface ServiceItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
}

export type BookingStatus =
  | 'pending_payment'
  | 'confirmed'
  | 'assigned'
  | 'en_route'
  | 'started'
  | 'completed'
  | 'cancelled';

export interface Booking {
  id: number;
  user_id: number;
  vehicle_id: number;
  plan_id: number;
  partner_id?: number;
  address: string;
  pincode: string;
  scheduled_at: string;
  status: BookingStatus;
  total_amount: number;
  before_photo_url?: string;
  after_photo_url?: string;
  plan?: Plan;
  vehicle?: Vehicle;
  partner?: Partner;
}

export interface Partner {
  id: number;
  user_id: number;
  verification_status: 'pending' | 'approved' | 'rejected';
  rating_avg: number;
  total_jobs: number;
  user?: User;
}

export interface Subscription {
  id: number;
  user_id: number;
  plan_id: number;
  status: 'active' | 'paused' | 'cancelled';
  next_billing_date: string;
  missed_credits: number;
  plan?: Plan;
}

export interface Review {
  id: number;
  booking_id: number;
  rating: number;
  comment: string;
  created_at: string;
}

export interface ServiceArea {
  id: number;
  pincode: string;
  city: string;
  is_active: boolean;
  is_waterless_zone: boolean;
}

export interface BookingFormState {
  vehicleId?: number;
  vehicleType?: Vehicle['type'];
  vehicleModel?: string;
  plate?: string;
  address: string;
  pincode: string;
  scheduledAt: string;
  planId?: number;
  extras: number[];
  totalAmount: number;
  couponCode?: string;
  societyId?: number;
}
