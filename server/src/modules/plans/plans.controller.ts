import { Request, Response } from 'express';
import * as service from './plans.service';
import { ok, notFound } from '../../utils/response';

export async function list(req: Request, res: Response): Promise<void> {
  const plans = await service.getAll();
  ok(res, plans);
}

export async function getOne(req: Request, res: Response): Promise<void> {
  const plan = await service.getById(Number(req.params.id));
  if (!plan) { notFound(res); return; }
  ok(res, plan);
}
