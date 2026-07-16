import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import * as service from './bookings.service';
import { ok, created, notFound, forbidden } from '../../utils/response';
import { BookingStatus } from '@prisma/client';
import { getIO } from '../../sockets/tracking.socket';

export async function createBooking(req: AuthRequest, res: Response): Promise<void> {
  const result = await service.create(req.user!.userId, req.body);
  created(res, result, 'Booking created');
}

export async function listBookings(req: AuthRequest, res: Response): Promise<void> {
  const bookings = await service.getAll(req.user!.userId);
  ok(res, bookings);
}

export async function getBooking(req: AuthRequest, res: Response): Promise<void> {
  const booking = await service.getById(Number(req.params.id), req.user!.userId);
  if (!booking) { notFound(res); return; }
  ok(res, booking);
}

export async function updateStatus(req: AuthRequest, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const booking = await service.getById(id);
  if (!booking) { notFound(res); return; }

  const isPartner = req.user!.role === 'partner' && booking.partner?.user_id === req.user!.userId;
  const isAdmin = req.user!.role === 'admin';
  if (!isPartner && !isAdmin) { forbidden(res); return; }

  const { status, before_photo_url, after_photo_url } = req.body;
  const updated = await service.updateStatus(id, status as BookingStatus, { before_photo_url, after_photo_url });

  // emit real-time update to the customer's socket room
  const io = getIO();
  io?.to(`booking:${id}`).emit('booking:status', { bookingId: id, status: updated.status });

  ok(res, updated, 'Status updated');
}
