import { Router, Response } from 'express';
import { z } from 'zod';
import prisma from '../../config/db';
import { authenticate, AuthRequest } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { ok, created, badRequest } from '../../utils/response';

const reviewSchema = z.object({
  booking_id: z.number().int().positive(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

const router = Router();
router.use(authenticate);

router.post('/', validate(reviewSchema), async (req: AuthRequest, res: Response) => {
  const { booking_id, rating, comment } = req.body;

  const booking = await prisma.booking.findFirst({
    where: { id: booking_id, user_id: req.user!.userId, status: 'completed' },
  });
  if (!booking) { badRequest(res, 'Booking not found or not completed'); return; }

  const existing = await prisma.review.findUnique({ where: { booking_id } });
  if (existing) { badRequest(res, 'Review already submitted'); return; }

  const review = await prisma.review.create({
    data: { booking_id, user_id: req.user!.userId, rating, comment },
  });

  // update partner rating average
  if (booking.partner_id) {
    const { _avg } = await prisma.review.aggregate({
      where: { booking: { partner_id: booking.partner_id } },
      _avg: { rating: true },
    });
    await prisma.partner.update({
      where: { id: booking.partner_id },
      data: { rating_avg: _avg.rating ?? 0, total_jobs: { increment: 1 } },
    });
  }

  created(res, review, 'Review submitted');
});

router.get('/booking/:bookingId', async (req, res: Response) => {
  const review = await prisma.review.findUnique({ where: { booking_id: Number(req.params.bookingId) } });
  ok(res, review);
});

export default router;
