import { Router, Response } from 'express';
import { z } from 'zod';
import * as service from './societies.service';
import { authenticate, AuthRequest } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/role.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { ok, created, notFound } from '../../utils/response';

const createSchema = z.object({
  name: z.string().min(2),
  address: z.string().min(5),
  pincode: z.string().length(6),
  contact_name: z.string().min(2),
  contact_phone: z.string().length(10),
  total_units: z.number().int().positive().optional(),
  billing_email: z.string().email().optional(),
});

const router = Router();
router.use(authenticate);

// Public: list active societies (for customer booking)
router.get('/', async (_req, res: Response) => {
  const data = await service.list();
  ok(res, data);
});

// Admin: create society
router.post('/', requireRole('admin'), validate(createSchema), async (req: AuthRequest, res: Response) => {
  const society = await service.create(req.body);
  created(res, society, 'Society created');
});

// Admin: update society
router.patch('/:id', requireRole('admin'), async (req: AuthRequest, res: Response) => {
  const society = await service.update(Number(req.params.id), req.body);
  ok(res, society);
});

// Admin: bulk subscribe a society
router.post('/:id/subscribe', requireRole('admin'), async (req: AuthRequest, res: Response) => {
  const { plan_id, unit_count } = req.body;
  const result = await service.bulkSubscribe(Number(req.params.id), plan_id, unit_count);
  ok(res, result, 'Bulk subscription created');
});

// Admin: get society's bookings
router.get('/:id/bookings', requireRole('admin'), async (req: AuthRequest, res: Response) => {
  const s = await service.getById(Number(req.params.id));
  if (!s) { notFound(res); return; }
  const bookings = await service.getBookings(Number(req.params.id));
  ok(res, { society: s, bookings });
});

export default router;
