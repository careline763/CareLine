import { Router, Response } from 'express';
import prisma from '../../config/db';
import { authenticate, AuthRequest } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/role.middleware';
import { ok, created } from '../../utils/response';
import { recalculate, getScoreBreakdown } from './scoring.service';

const router = Router();
router.use(authenticate);

// Register as a partner
router.post('/register', async (req: AuthRequest, res: Response) => {
  const existing = await prisma.partner.findUnique({ where: { user_id: req.user!.userId } });
  if (existing) { ok(res, existing, 'Already registered'); return; }
  const partner = await prisma.partner.create({ data: { user_id: req.user!.userId } });
  created(res, partner, 'Partner registration submitted');
});

// Partner: their own jobs
router.get('/jobs', requireRole('partner'), async (req: AuthRequest, res: Response) => {
  const partner = await prisma.partner.findUnique({ where: { user_id: req.user!.userId } });
  if (!partner) { ok(res, []); return; }
  const jobs = await prisma.booking.findMany({
    where: { partner_id: partner.id },
    include: { user: true, vehicle: true, plan: true },
    orderBy: { scheduled_at: 'asc' },
  });
  ok(res, jobs);
});

// Partner: get own quality score
router.get('/my-score', requireRole('partner'), async (req: AuthRequest, res: Response) => {
  const partner = await prisma.partner.findUnique({ where: { user_id: req.user!.userId } });
  if (!partner) { ok(res, null); return; }
  const score = await getScoreBreakdown(partner.id);
  ok(res, score);
});

// Admin: list all partners with scores
router.get('/', requireRole('admin'), async (_req, res: Response) => {
  const partners = await prisma.partner.findMany({
    include: { user: true },
    orderBy: { quality_score: 'desc' },
  });
  ok(res, partners);
});

// Admin: get score breakdown for a partner
router.get('/:id/score', requireRole('admin'), async (req: AuthRequest, res: Response) => {
  const score = await getScoreBreakdown(Number(req.params.id));
  ok(res, score);
});

// Admin: trigger score recalculation
router.post('/:id/score/recalculate', requireRole('admin'), async (req: AuthRequest, res: Response) => {
  const score = await recalculate(Number(req.params.id));
  ok(res, score, 'Score recalculated');
});

// Admin: approve/reject partner
router.patch('/:id/verify', requireRole('admin'), async (req, res: Response) => {
  const { status } = req.body;
  const partner = await prisma.partner.update({
    where: { id: Number(req.params.id) },
    data: { verification_status: status },
  });
  ok(res, partner, 'Verification updated');
});

export default router;
