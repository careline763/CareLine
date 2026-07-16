import { z } from 'zod';

export const createBookingSchema = z.object({
  vehicle_id: z.number().int().positive(),
  plan_id: z.number().int().positive(),
  address: z.string().min(10),
  pincode: z.string().regex(/^\d{6}$/),
  scheduled_at: z.string().datetime(),
  extras_json: z.array(z.number()).optional(),
  total_amount: z.number().positive(),
  notes: z.string().optional(),
  coupon_code: z.string().optional(),
  society_id: z.number().int().positive().optional(),
});

export const updateStatusSchema = z.object({
  status: z.enum(['confirmed', 'assigned', 'en_route', 'started', 'completed', 'cancelled']),
  before_photo_url: z.string().url().optional(),
  after_photo_url: z.string().url().optional(),
});
