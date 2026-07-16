import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as ctrl from './auth.controller';
import { validate } from '../../middlewares/validate.middleware';
import { authenticate } from '../../middlewares/auth.middleware';
import { sendOtpSchema, verifyOtpSchema, refreshSchema } from './auth.validation';

const router = Router();

// Production: 5 OTP attempts per 15 min. Dev: 1000 so testing never hits the limit.
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 5 : 1000,
  message: 'Too many OTP requests',
});

router.post('/otp/send', otpLimiter, validate(sendOtpSchema), ctrl.sendOtp);
router.post('/otp/verify', otpLimiter, validate(verifyOtpSchema), ctrl.verifyOtp);
router.post('/refresh', validate(refreshSchema), ctrl.refresh);
router.post('/logout', ctrl.logout);
router.get('/me', authenticate, ctrl.getMe);

export default router;
