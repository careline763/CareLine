import prisma from '../../config/db';
import razorpay from '../../config/razorpay';
import { BookingStatus } from '@prisma/client';
import * as couponService from '../coupons/coupons.service';
import { settleReferralReward } from '../referrals/referrals.service';
import { calculate as calcPrice } from '../pricing/pricing.service';
import { recalculate as recalcScore } from '../partners/scoring.service';
import { notify } from '../notifications/notifications.service';
import { buildEmail } from '../../utils/email';

export async function create(userId: number, data: {
  vehicle_id: number; plan_id: number; address: string;
  pincode: string; scheduled_at: string; extras_json?: number[];
  total_amount: number; notes?: string; coupon_code?: string;
  society_id?: number;
}) {
  // Apply dynamic pricing
  const pricing = await calcPrice({
    plan_id: data.plan_id,
    scheduled_at: data.scheduled_at,
    pincode: data.pincode,
  });
  const surgedAmount = pricing.final_price;

  // Apply coupon
  let discountAmount = 0;
  let couponId: number | undefined;
  if (data.coupon_code) {
    const result = await couponService.apply(data.coupon_code, userId, surgedAmount);
    if (result.valid && result.coupon_id) {
      discountAmount = result.discount ?? 0;
      couponId = result.coupon_id;
    }
  }

  // Apply wallet
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  const walletApplied = Math.min(Number(user.wallet_balance), surgedAmount - discountAmount);
  const finalAmount = Math.max(surgedAmount - discountAmount - walletApplied, 0);

  const booking = await prisma.booking.create({
    data: {
      user_id: userId,
      vehicle_id: data.vehicle_id,
      plan_id: data.plan_id,
      society_id: data.society_id,
      coupon_id: couponId,
      address: data.address,
      pincode: data.pincode,
      scheduled_at: new Date(data.scheduled_at),
      extras_json: data.extras_json || [],
      total_amount: surgedAmount,
      discount_amount: discountAmount + walletApplied,
      surge_multiplier: pricing.surge_multiplier,
      notes: data.notes,
      status: 'pending_payment',
    },
    include: { plan: true, vehicle: true },
  });

  if (couponId) await couponService.markUsed(couponId);
  if (walletApplied > 0) {
    await prisma.user.update({
      where: { id: userId },
      data: { wallet_balance: { decrement: walletApplied } },
    });
  }

  // Notify customer: booking confirmation
  const dt = new Date(data.scheduled_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
  notify(userId, 'booking_confirmed', {
    title: 'Booking Confirmed!',
    body: `Your ${booking.plan.name} wash is booked for ${dt}. Amount: ₹${surgedAmount}.`,
    data: { bookingId: booking.id },
    emailHtml: buildEmail(
      'Booking Confirmed — SparkWash',
      `<p>Hi there! Your <strong>${booking.plan.name}</strong> car wash is confirmed.</p>
       <p><strong>Date & Time:</strong> ${dt}</p>
       <p><strong>Vehicle:</strong> ${booking.vehicle.model} (${booking.vehicle.plate_number})</p>
       <p><strong>Address:</strong> ${data.address}</p>
       <p><strong>Amount:</strong> ₹${surgedAmount}${discountAmount > 0 ? ` (saved ₹${discountAmount + walletApplied})` : ''}</p>`,
      { label: 'Track Your Booking', url: `${process.env.CLIENT_URL}/bookings` }
    ),
  }).catch(() => {});

  const order = await razorpay.orders.create({
    amount: Math.round(finalAmount * 100),
    currency: 'INR',
    receipt: `booking_${booking.id}`,
  });

  await prisma.payment.create({
    data: { booking_id: booking.id, razorpay_order_id: order.id, amount: finalAmount, status: 'pending' },
  });

  return {
    booking,
    pricing: { base: data.total_amount, surge_multiplier: pricing.surge_multiplier, surged: surgedAmount, surge_reasons: pricing.surge_reasons, is_surge: pricing.is_surge },
    discount_amount: discountAmount + walletApplied,
    final_amount: finalAmount,
    razorpay_order_id: order.id,
    razorpay_key_id: process.env.RAZORPAY_KEY_ID,
  };
}

export async function getAll(userId: number) {
  return prisma.booking.findMany({
    where: { user_id: userId },
    include: { plan: true, vehicle: true, partner: { include: { user: true } }, review: true },
    orderBy: { created_at: 'desc' },
  });
}

export async function getById(id: number, userId?: number) {
  return prisma.booking.findFirst({
    where: { id, ...(userId ? { user_id: userId } : {}) },
    include: {
      plan: true, vehicle: true,
      partner: { include: { user: true } },
      payment: true, review: true, complaints: true,
    },
  });
}

export async function updateStatus(id: number, status: BookingStatus, photoData?: {
  before_photo_url?: string; after_photo_url?: string;
}) {
  const booking = await prisma.booking.update({
    where: { id },
    data: { status, ...photoData },
    include: { user: true, plan: true, partner: { include: { user: true } } },
  });

  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

  if (status === 'assigned' && booking.partner) {
    // Notify customer their partner is assigned
    notify(booking.user_id, 'booking_assigned', {
      title: 'Partner Assigned!',
      body: `${booking.partner.user.name} will clean your car. They'll be on their way shortly.`,
      data: { bookingId: id },
    }).catch(() => {});

    // Notify partner about new job
    notify(booking.partner.user_id, 'booking_assigned', {
      title: 'New Job Assigned!',
      body: `You have a new wash job (#${id}). Check your app for details.`,
      data: { bookingId: id },
    }).catch(() => {});
  }

  if (status === 'en_route') {
    notify(booking.user_id, 'partner_en_route', {
      title: 'Partner is on the way!',
      body: `Your SparkWash partner is heading to you. Track live in the app.`,
      data: { bookingId: id },
    }).catch(() => {});
  }

  if (status === 'completed') {
    // Notify customer: job done
    notify(booking.user_id, 'booking_completed', {
      title: 'Your car is sparkling clean!',
      body: `Booking #${id} completed. Tap to rate your experience.`,
      data: { bookingId: id },
      emailHtml: buildEmail(
        'Car Wash Completed — SparkWash',
        `<p>Your <strong>${booking.plan.name}</strong> wash is done!</p>
         <p>How was your experience? Leave a rating to help us improve.</p>`,
        { label: 'Rate Your Experience', url: `${clientUrl}/reviews/${id}` }
      ),
    }).catch(() => {});

    // Settle referral reward on first completed booking
    const count = await prisma.booking.count({
      where: { user_id: booking.user_id, status: 'completed' },
    });
    if (count === 1) await settleReferralReward(booking.user_id);

    // Recalculate partner quality score
    if (booking.partner_id) {
      recalcScore(booking.partner_id).catch(() => {});
    }
  }

  if (status === 'cancelled') {
    notify(booking.user_id, 'booking_cancelled', {
      title: 'Booking Cancelled',
      body: `Booking #${id} has been cancelled. Any amount paid will be refunded within 3–5 business days.`,
      data: { bookingId: id },
    }).catch(() => {});
  }

  return booking;
}

export async function assignPartner(bookingId: number, partnerId: number) {
  return prisma.booking.update({
    where: { id: bookingId },
    data: { partner_id: partnerId, status: 'assigned' },
  });
}
