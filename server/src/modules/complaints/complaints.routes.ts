import { Router, Response } from 'express';
import { z } from 'zod';
import * as service from './complaints.service';
import { authenticate, AuthRequest } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/role.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { ok, created, notFound, forbidden } from '../../utils/response';
import { ComplaintStatus } from '@prisma/client';

const createSchema = z.object({
  booking_id: z.number().int().positive(),
  type: z.enum(['service_quality', 'partner_behaviour', 'billing', 'other']),
  description: z.string().min(10).max(2000),
});

const resolveSchema = z.object({
  status: z.enum(['open', 'investigating', 'resolved', 'refunded']),
  resolution: z.string().optional(),
  refund_amount: z.number().positive().optional(),
});

const router = Router();
router.use(authenticate);

// Customer: file complaint
router.post('/', validate(createSchema), async (req: AuthRequest, res: Response) => {
  const complaint = await service.create(req.user!.userId, req.body);
  created(res, complaint, 'Complaint filed');
});

// Customer: my complaints
router.get('/mine', async (req: AuthRequest, res: Response) => {
  const data = await service.listByUser(req.user!.userId);
  ok(res, data);
});

// Admin: list all
router.get('/', requireRole('admin'), async (req: AuthRequest, res: Response) => {
  const status = req.query.status as ComplaintStatus | undefined;
  const data = await service.listAll(status);
  ok(res, data);
});

// Admin: get single
router.get('/:id', requireRole('admin'), async (req: AuthRequest, res: Response) => {
  const c = await service.getById(Number(req.params.id));
  if (!c) { notFound(res); return; }
  ok(res, c);
});

// Admin: resolve / refund
router.patch('/:id/resolve', requireRole('admin'), validate(resolveSchema), async (req: AuthRequest, res: Response) => {
  const updated = await service.resolve(Number(req.params.id), req.body);
  ok(res, updated, 'Complaint updated');
});

export default router;
