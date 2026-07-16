import prisma from '../../config/db';

export const getUserSubs = (userId: number) =>
  prisma.subscription.findMany({
    where: { user_id: userId },
    include: { plan: true },
    orderBy: { created_at: 'desc' },
  });

export const create = (userId: number, planId: number) => {
  const next = new Date();
  next.setMonth(next.getMonth() + 1);
  return prisma.subscription.create({
    data: { user_id: userId, plan_id: planId, next_billing_date: next },
    include: { plan: true },
  });
};

export const pause = (id: number, userId: number) =>
  prisma.subscription.updateMany({
    where: { id, user_id: userId, status: 'active' },
    data: { status: 'paused' },
  });

export const resume = (id: number, userId: number) =>
  prisma.subscription.updateMany({
    where: { id, user_id: userId, status: 'paused' },
    data: { status: 'active' },
  });

export const cancel = (id: number, userId: number) =>
  prisma.subscription.updateMany({
    where: { id, user_id: userId },
    data: { status: 'cancelled' },
  });
