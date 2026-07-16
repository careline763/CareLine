import { sendSMS } from './sms';

export function generateOTP(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function otpExpiresAt(minutes = 10): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}

export async function sendOTP(phone: string, otp: string): Promise<void> {
  const message = `${otp} is your SparkWash OTP. Valid for 10 minutes. Do not share it with anyone. - SparkWash`;
  await sendSMS(phone, message);
}
