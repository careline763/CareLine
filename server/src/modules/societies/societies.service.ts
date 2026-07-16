import prisma from '../../config/db';

export const list = () =>
  prisma.society.findMany({ orderBy: { name: 'asc' } });

export const getById = (id: number) =>
  prisma.society.findUnique({ where: { id } });

export const create = (data: {
  name: string; address: string; pincode: string;
  contact_name: string; contact_phone: string;
  total_units?: number; billing_email?: string;
}) => prisma.society.create({ data });

export const update = (id: number, data: Partial<{
  name: string; address: string; pincode: string;
  contact_name: string; contact_phone: string;
  total_units: number; billing_email: string; is_active: boolean;
}>) => prisma.society.update({ where: { id }, data });

export const getBookings = (id: number) =>
  prisma.booking.findMany({
    where: { society_id: id },
    include: { user: true, vehicle: true, plan: true, partner: { include: { user: true } } },
    orderBy: { scheduled_at: 'desc' },
  });

export const bulkSubscribe = async (societyId: number, planId: number, unitCount: number) => {
  const society = await prisma.society.findUniqueOrThrow({ where: { id: societyId } });
  const plan = await prisma.plan.findUniqueOrThrow({ where: { id: planId } });

  const next = new Date();
  next.setMonth(next.getMonth() + 1);

  // Create a "manager" user for the society if needed — for now return plan info
  await prisma.society.update({
    where: { id: societyId },
    data: { active_units: { increment: unitCount } },
  });

  return {
    society,
    plan,
    units: unitCount,
    total_monthly: Number(plan.price) * unitCount,
    next_billing_date: next,
  };
};
