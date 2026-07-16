import { Router, Response } from 'express';
import { z } from 'zod';
import * as service from './coupons.service';
import { authenticate, AuthRequest } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/role.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { ok, created, badRequest } from '../../utils/response';

const createSchema = z.object({
  code: z.string().min(3).max(20).toUpperCase(),
  discount_type: z.enum(['flat', 'percent']),
  value: z.number().positive(),
  valid_till: z.string().datetime(),
  max_uses: z.number().int().positive().optional(),
  min_order_amount: z.number().positive().optional(),
  max_discount: z.number().positive().optional(),
  first_booking_only: z.boolean().optional(),
});

const applySchema = z.object({
  code: z.string().min(1),
  order_amount: z.number().positive(),
});

const router = Router();
router.use(authenticate);

// Customer: apply coupon (returns discount amount — booking creation handles marking used)
router.post('/apply', validate(applySchema), async (req: AuthRequest, res: Response) => {
  const result = await service.apply(req.body.code, req.user!.userId, req.body.order_amount);
  if (!result.valid) { badRequest(res, result.message); return; }
  ok(res, result, result.message);
});

// Admin: list all coupons
router.get('/', requireRole('admin'), async (_req, res: Response) => {
  const data = await service.list();
  ok(res, data);
});

// Admin: create coupon
router.post('/', requireRole('admin'), validate(createSchema), async (req: AuthRequest, res: Response) => {
  const coupon = await service.create(req.body);
  created(res, coupon, 'Coupon created');
});

// Admin: toggle active
router.patch('/:id/toggle', requireRole('admin'), async (req: AuthRequest, res: Response) => {
  const { is_active } = req.body;
  const c = await service.toggle(Number(req.params.id), is_active);
  ok(res, c, `Coupon ${is_active ? 'activated' : 'deactivated'}`);
});

export default router;
