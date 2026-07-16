import { Router, Response } from 'express';
import { z } from 'zod';
import * as service from './referrals.service';
import { authenticate, AuthRequest } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/role.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { ok, badRequest } from '../../utils/response';

const applySchema = z.object({ referral_code: z.string().min(3) });

const router = Router();
router.use(authenticate);

// Get or generate my referral code
router.get('/my-code', async (req: AuthRequest, res: Response) => {
  const data = await service.getOrCreateCode(req.user!.userId);
  ok(res, data);
});

// My referrals list (people I referred)
router.get('/mine', async (req: AuthRequest, res: Response) => {
  const data = await service.listByUser(req.user!.userId);
  ok(res, data);
});

// Apply someone's referral code (called after registration)
router.post('/apply', validate(applySchema), async (req: AuthRequest, res: Response) => {
  const result = await service.applyReferral(req.body.referral_code, req.user!.userId);
  if (!result.valid) { badRequest(res, result.message); return; }
  ok(res, result, result.message);
});

// Admin: all referrals
router.get('/', requireRole('admin'), async (_req, res: Response) => {
  const data = await service.listAll();
  ok(res, data);
});

export default router;
