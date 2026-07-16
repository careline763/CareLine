import api from './api';
import type { Booking, BookingFormState } from '../types';

export const createBooking = (data: BookingFormState) =>
  api.post<{ booking: Booking; razorpay_order_id: string }>('/bookings', data);

export const getBookings = () => api.get<Booking[]>('/bookings');

export const getBookingById = (id: number) => api.get<Booking>(`/bookings/${id}`);

export const createPaymentOrder = (bookingId: number) =>
  api.post<{ order_id: string; amount: number; currency: string }>(
    '/payments/create-order',
    { booking_id: bookingId }
  );
