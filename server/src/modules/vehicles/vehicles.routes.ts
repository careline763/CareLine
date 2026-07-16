import { Router } from 'express';
import prisma from '../../config/db';
import { authenticate, AuthRequest } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { createVehicleSchema } from './vehicles.validation';
import { ok, created, notFound, forbidden } from '../../utils/response';
import { Response } from 'express';

const router = Router();
router.use(authenticate);

router.get('/', async (req: AuthRequest, res: Response) => {
  const vehicles = await prisma.vehicle.findMany({ where: { user_id: req.user!.userId } });
  ok(res, vehicles);
});

router.post('/', validate(createVehicleSchema), async (req: AuthRequest, res: Response) => {
  const vehicle = await prisma.vehicle.create({
    data: { ...req.body, user_id: req.user!.userId },
  });
  created(res, vehicle, 'Vehicle added');
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  const vehicle = await prisma.vehicle.findUnique({ where: { id: Number(req.params.id) } });
  if (!vehicle) { notFound(res); return; }
  if (vehicle.user_id !== req.user!.userId) { forbidden(res); return; }
  await prisma.vehicle.delete({ where: { id: vehicle.id } });
  ok(res, null, 'Vehicle removed');
});

export default router;
