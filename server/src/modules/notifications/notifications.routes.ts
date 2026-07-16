import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/role.middleware';
import * as svc from './notifications.service';
import { VAPID_PUBLIC_KEY } from '../../utils/push';
import prisma from '../../config/db';
import type { AuthRequest } from '../../middlewares/auth.middleware';

const router = Router();
router.use(authenticate);

// GET /api/notifications — list for current user
router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const page = Number(req.query.page ?? 1);
    const [items, unread] = await Promise.all([
      svc.list(req.user!.userId, page),
      svc.unreadCount(req.user!.userId),
    ]);
    res.json({ success: true, data: { items, unread } });
  } catch (err) { next(err); }
});

// GET /api/notifications/unread-count
router.get('/unread-count', async (req: AuthRequest, res, next) => {
  try {
    res.json({ success: true, data: await svc.unreadCount(req.user!.userId) });
  } catch (err) { next(err); }
});

// GET /api/notifications/vapid-key
router.get('/vapid-key', (_req, res) => {
  res.json({ success: true, data: VAPID_PUBLIC_KEY });
});

// PATCH /api/notifications/:id/read
router.patch('/:id/read', async (req: AuthRequest, res, next) => {
  try {
    await svc.markRead(Number(req.params.id), req.user!.userId);
    res.json({ success: true });
  } catch (err) { next(err); }
});

// PATCH /api/notifications/read-all
router.patch('/read-all', async (req: AuthRequest, res, next) => {
  try {
    await svc.markAllRead(req.user!.userId);
    res.json({ success: true });
  } catch (err) { next(err); }
});

// POST /api/notifications/push-subscribe
router.post('/push-subscribe', async (req: AuthRequest, res, next) => {
  try {
    const { endpoint, keys, device } = req.body;
    await svc.savePushSub(req.user!.userId, { endpoint, p256dh: keys.p256dh, auth: keys.auth, device });
    res.json({ success: true });
  } catch (err) { next(err); }
});

// DELETE /api/notifications/push-subscribe
router.delete('/push-subscribe', async (req: AuthRequest, res, next) => {
  try {
    await svc.deletePushSub(req.user!.userId, req.body.endpoint);
    res.json({ success: true });
  } catch (err) { next(err); }
});

// POST /api/notifications/broadcast — admin only
router.post('/broadcast', requireRole('admin'), async (req: AuthRequest, res, next) => {
  try {
    const { title, body, target } = req.body; // target: 'all' | 'customers' | 'partners'
    const role = target === 'partners' ? 'partner' : target === 'customers' ? 'customer' : undefined;
    const users = await prisma.user.findMany({
      where: role ? { role: role as never } : {},
      select: { id: true },
    });
    await svc.broadcast(users.map(u => u.id), { title, body });
    res.json({ success: true, data: { sent_to: users.length } });
  } catch (err) { next(err); }
});

export default router;
