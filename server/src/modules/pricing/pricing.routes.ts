import { Router, Response } from 'express';
import { z } from 'zod';
import * as service from './pricing.service';
import { authenticate, AuthRequest } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/role.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { ok, created } from '../../utils/response';

const calcSchema = z.object({
  plan_id: z.number().int().positive(),
  scheduled_at: z.string().datetime(),
  pincode: z.string().length(6),
});

const ruleSchema = z.object({
  id: z.number().int().optional(),
  name: z.string().min(2),
  type: z.enum(['peak_hour', 'weekend', 'demand', 'waterless', 'vehicle_type']),
  multiplier: z.number().min(1).max(3),
  config_json: z.record(z.unknown()).optional(),
  is_active: z.boolean().optional(),
});

const router = Router();
router.use(authenticate);

// Any authenticated user: calculate surge price for a slot
router.post('/calculate', validate(calcSchema), async (req: AuthRequest, res: Response) => {
  const result = await service.calculate(req.body);
  ok(res, result);
});

// Admin: list all pricing rules
router.get('/rules', requireRole('admin'), async (_req, res: Response) => {
  const rules = await service.listRules();
  ok(res, rules);
});

// Admin: create or update pricing rule
router.put('/rules', requireRole('admin'), validate(ruleSchema), async (req: AuthRequest, res: Response) => {
  const rule = await service.upsertRule(req.body);
  ok(res, rule, 'Rule saved');
});

export default router;
