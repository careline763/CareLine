import { Router } from 'express';
import prisma from '../../config/db';
import { ok } from '../../utils/response';

const router = Router();

router.get('/', async (_req, res) => {
  const services = await prisma.service.findMany({ where: { is_active: true } });
  ok(res, services);
});

export default router;
