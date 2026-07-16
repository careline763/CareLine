import { z } from 'zod';

export const sendOtpSchema = z.object({
  phone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
});

export const verifyOtpSchema = z.object({
  phone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
  name: z.string().min(2).optional(),
});

export const refreshSchema = z.object({
  refresh_token: z.string().min(1),
});
