import { Request, Response } from 'express';
import * as authService from './auth.service';
import { ok, created, badRequest, unauthorized } from '../../utils/response';
import { AuthRequest } from '../../middlewares/auth.middleware';

export async function sendOtp(req: Request, res: Response): Promise<void> {
  const { phone } = req.body;
  // initOTP returns the test OTP string when OTP_BYPASS=true (dev/staging only),
  // or undefined in production. The dev_otp field is omitted from the response
  // in production because testOtp will be undefined.
  const testOtp = await authService.initOTP(phone);
  ok(res, testOtp ? { dev_otp: testOtp } : null, 'OTP sent successfully');
}

export async function verifyOtp(req: Request, res: Response): Promise<void> {
  const { phone, otp, name } = req.body;
  try {
    const result = await authService.verifyAndLogin(phone, otp, name);
    created(res, result, 'Login successful');
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Verification failed';
    unauthorized(res, msg);
  }
}

export async function refresh(req: Request, res: Response): Promise<void> {
  const { refresh_token } = req.body;
  try {
    const tokens = await authService.refreshTokens(refresh_token);
    ok(res, tokens, 'Token refreshed');
  } catch {
    unauthorized(res, 'Invalid or expired refresh token');
  }
}

export async function getMe(req: AuthRequest, res: Response): Promise<void> {
  const user = await authService.getMe(req.user!.userId);
  if (!user) { unauthorized(res); return; }
  ok(res, user);
}

export async function logout(req: AuthRequest, res: Response): Promise<void> {
  const { refresh_token } = req.body;
  if (refresh_token) {
    const prisma = (await import('../../config/db')).default;
    await prisma.refreshToken.deleteMany({ where: { token: refresh_token } }).catch(() => null);
  }
  ok(res, null, 'Logged out');
}
