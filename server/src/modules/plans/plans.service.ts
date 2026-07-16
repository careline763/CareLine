import prisma from '../../config/db';

export const getAll = () =>
  prisma.plan.findMany({ where: { is_active: true }, orderBy: { price: 'asc' } });

export const getById = (id: number) =>
  prisma.plan.findUnique({ where: { id } });
