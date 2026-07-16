import prisma from '../../config/db';
import { ComplaintType, ComplaintStatus } from '@prisma/client';
import { notify } from '../notifications/notifications.service';

export const create = (userId: number, data: {
  booking_id: number; type: ComplaintType; description: string;
}) =>
  prisma.complaint.create({
    data: { ...data, user_id: userId },
    include: { booking: { include: { plan: true } } },
  });

export const listByUser = (userId: number) =>
  prisma.complaint.findMany({
    where: { user_id: userId },
    include: { booking: { include: { plan: true } } },
    orderBy: { created_at: 'desc' },
  });

export const listAll = (status?: ComplaintStatus) =>
  prisma.complaint.findMany({
    where: status ? { status } : {},
    include: {
      user: { select: { id: true, name: true, phone: true } },
      booking: { include: { plan: true, vehicle: true } },
    },
    orderBy: { created_at: 'desc' },
  });

export const getById = (id: number) =>
  prisma.complaint.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, phone: true } },
      booking: { include: { plan: true, vehicle: true, payment: true } },
    },
  });

export const resolve = async (id: number, data: {
  status: ComplaintStatus; resolution?: string; refund_amount?: number;
}) => {
  const complaint = await prisma.complaint.update({
    where: { id },
    data: {
      status: data.status,
      resolution: data.resolution,
      refund_amount: data.refund_amount,
    },
    include: { booking: { include: { payment: true } } },
  });

  // If refunding, mark payment as refunded and credit wallet
  if (data.status === 'refunded' && data.refund_amount && complaint.booking.payment) {
    await prisma.$transaction([
      prisma.payment.update({
        where: { id: complaint.booking.payment.id },
        data: { status: 'refunded', refunded_at: new Date() },
      }),
      prisma.user.update({
        where: { id: complaint.user_id },
        data: { wallet_balance: { increment: data.refund_amount } },
      }),
    ]);
  }

  // Notify customer about resolution
  const resolutionNote = data.resolution ? ` Resolution: ${data.resolution}` : '';
  const refundNote = data.status === 'refunded' && data.refund_amount
    ? ` ₹${data.refund_amount} has been added to your wallet.`
    : '';

  notify(complaint.user_id, 'complaint_resolved', {
    title: data.status === 'refunded' ? 'Refund Processed' : 'Complaint Resolved',
    body: `Your complaint has been ${data.status}.${resolutionNote}${refundNote}`,
    data: { complaintId: id },
  }).catch(() => {});

  return complaint;
};
