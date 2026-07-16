import { Router } from 'express';
import prisma from '../../config/db';
import { ok, notFound } from '../../utils/response';

const router = Router();

router.get('/:pincode', async (req, res) => {
  const area = await prisma.serviceArea.findUnique({ where: { pincode: req.params.pincode } });
  if (!area) { notFound(res, 'Pincode not serviceable'); return; }
  ok(res, area);
});

export default router;
