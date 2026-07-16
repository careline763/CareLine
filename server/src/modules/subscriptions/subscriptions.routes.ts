import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../../middlewares/auth.middleware';
import * as service from './subscriptions.service';
import { ok, created } from '../../utils/response';

const router = Router();
router.use(authenticate);

router.get('/', async (req: AuthRequest, res: Response) => {
  const subs = await service.getUserSubs(req.user!.userId);
  ok(res, subs);
});

router.post('/', async (req: AuthRequest, res: Response) => {
  const { plan_id } = req.body;
  const sub = await service.create(req.user!.userId, plan_id);
  created(res, sub, 'Subscription created');
});

router.post('/:id/pause', async (req: AuthRequest, res: Response) => {
  await service.pause(Number(req.params.id), req.user!.userId);
  ok(res, null, 'Subscription paused');
});

router.post('/:id/resume', async (req: AuthRequest, res: Response) => {
  await service.resume(Number(req.params.id), req.user!.userId);
  ok(res, null, 'Subscription resumed');
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  await service.cancel(Number(req.params.id), req.user!.userId);
  ok(res, null, 'Subscription cancelled');
});

export default router;
