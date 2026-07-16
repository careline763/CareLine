import prisma from '../../config/db';

export const listFleets = () =>
  prisma.fleet.findMany({
    include: { _count: { select: { members: true, vehicles: true, bookings: true } } },
    orderBy: { created_at: 'desc' },
  });

export const getFleet = (id: number) =>
  prisma.fleet.findUniqueOrThrow({
    where: { id },
    include: {
      members: { include: { user: { select: { id: true, name: true, phone: true, email: true } } } },
      vehicles: { include: { vehicle: true } },
      invoices: { orderBy: { period_start: 'desc' }, take: 12 },
    },
  });

export const createFleet = (data: {
  name: string; company_name: string; billing_email: string;
  contact_phone: string; gstin?: string;
}) => prisma.fleet.create({ data });

export const updateFleet = (id: number, data: Partial<{
  name: string; company_name: string; billing_email: string;
  contact_phone: string; gstin: string; is_active: boolean;
}>) => prisma.fleet.update({ where: { id }, data });

export const addMember = async (fleetId: number, userId: number, role: 'manager' | 'member' = 'member') => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await prisma.user.update({ where: { id: userId }, data: { role: 'fleet_manager' as any } });
  return prisma.fleetMember.create({ data: { fleet_id: fleetId, user_id: userId, role } });
};

export const removeMember = (fleetId: number, userId: number) =>
  prisma.fleetMember.delete({ where: { fleet_id_user_id: { fleet_id: fleetId, user_id: userId } } });

export const addVehicle = (fleetId: number, vehicleId: number) =>
  prisma.fleetVehicle.create({ data: { fleet_id: fleetId, vehicle_id: vehicleId } });

export const removeVehicle = (vehicleId: number) =>
  prisma.fleetVehicle.delete({ where: { vehicle_id: vehicleId } });

export const listFleetBookings = (fleetId: number, page = 1, limit = 20) =>
  prisma.booking.findMany({
    where: { fleet_id: fleetId },
    include: { vehicle: true, plan: true, partner: { include: { user: true } } },
    orderBy: { scheduled_at: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
  });

export const generateInvoice = async (fleetId: number, periodStart: Date, periodEnd: Date) => {
  const bookings = await prisma.booking.findMany({
    where: {
      fleet_id: fleetId,
      status: 'completed',
      fleet_invoice_id: null,
      scheduled_at: { gte: periodStart, lte: periodEnd },
    },
  });

  const total = bookings.reduce((sum, b) => sum + Number(b.total_amount), 0);

  const invoice = await prisma.fleetInvoice.create({
    data: {
      fleet_id: fleetId,
      period_start: periodStart,
      period_end: periodEnd,
      total_amount: total,
      booking_count: bookings.length,
      status: 'draft',
    },
  });

  if (bookings.length > 0) {
    await prisma.booking.updateMany({
      where: { id: { in: bookings.map(b => b.id) } },
      data: { fleet_invoice_id: invoice.id },
    });
  }

  return invoice;
};

export const listInvoices = (fleetId: number) =>
  prisma.fleetInvoice.findMany({
    where: { fleet_id: fleetId },
    orderBy: { period_start: 'desc' },
  });

export const updateInvoiceStatus = (id: number, status: 'draft' | 'sent' | 'paid') =>
  prisma.fleetInvoice.update({ where: { id }, data: { status } });
