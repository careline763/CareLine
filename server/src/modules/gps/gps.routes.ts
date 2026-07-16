import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { getRoute } from './gps.service';

const router = Router();

// GET /api/gps/:bookingId/route
router.get('/:bookingId/route', authenticate, async (req, res, next) => {
  try {
    const route = await getRoute(Number(req.params.bookingId));
    if (!route) return res.status(404).json({ success: false, message: 'No route recorded' });
    res.json({ success: true, data: route });
  } catch (err) { next(err); }
});

export default router;
