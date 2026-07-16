export type BookingStatus = 'pending_payment'|'confirmed'|'assigned'|'en_route'|'started'|'completed'|'cancelled';
export type VerificationStatus = 'pending'|'approved'|'rejected';
export type SubStatus = 'active'|'paused'|'cancelled';
export type PlanType = 'one_time'|'weekly'|'monthly'|'society';

export interface User { id:number; name:string; phone:string; email?:string; role:string; created_at:string; }
export interface Vehicle { id:number; user_id:number; type:string; model:string; plate_number:string; }
export interface Plan { id:number; name:string; type:PlanType; price:number; frequency:string; includes_json:string[]; popular:boolean; is_active:boolean; }
export interface ServiceArea { id:number; pincode:string; city:string; is_active:boolean; is_waterless_zone:boolean; }

export interface Partner {
  id:number; user_id:number; verification_status:VerificationStatus;
  rating_avg:number; total_jobs:number; is_available:boolean;
  user:User; created_at:string;
}

export interface Booking {
  id:number; user_id:number; vehicle_id:number; plan_id:number; partner_id?:number;
  address:string; pincode:string; scheduled_at:string; status:BookingStatus;
  total_amount:number; created_at:string;
  user?:User; plan?:Plan; vehicle?:Vehicle; partner?:Partner;
}

export interface Subscription {
  id:number; user_id:number; plan_id:number; status:SubStatus;
  next_billing_date:string; missed_credits:number; created_at:string;
  user?:User; plan?:Plan;
}

export interface Coupon {
  id:number; code:string; discount_type:'flat'|'percent'; value:number;
  valid_till:string; max_uses:number; used_count:number; is_active:boolean;
}

export interface Society {
  id:number; name:string; address:string; pincode:string;
  contact_name:string; contact_phone:string; total_units:number;
  active_units:number; billing_email?:string; is_active:boolean; created_at:string;
}

export type ComplaintType = 'service_quality'|'partner_behaviour'|'billing'|'other';
export type ComplaintStatus = 'open'|'investigating'|'resolved'|'refunded';

export interface Complaint {
  id:number; booking_id:number; user_id:number; type:ComplaintType;
  description:string; status:ComplaintStatus; resolution?:string;
  refund_amount?:number; created_at:string; updated_at:string;
  user?:User; booking?:Booking;
}

export interface Referral {
  id:number; referrer_id:number; referred_id:number; reward_status:string;
  reward_amount?:number; rewarded_at?:string; created_at:string;
  referrer?:User; referred?:User;
}

export interface DashboardStats {
  totalBookings:number; todayBookings:number; totalRevenue:number; monthRevenue:number;
  activeSubscriptions:number; totalPartners:number; pendingPartners:number; totalCustomers:number;
  revenueByDay:{ date:string; amount:number }[];
  bookingsByStatus:{ status:string; count:number }[];
}
