import crypto from 'crypto';
import prisma from '../../config/db';
import { env } from '../../config/env';

export async function confirmPayment(data: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) {
  const body = `${data.razorpay_order_id}|${data.razorpay_payment_id}`;
  const expected = crypto
    .createHmac('sha256', env.razorpay.keySecret)
    .update(body)
    .digest('hex');

  if (expected !== data.razorpay_signature) throw new Error('Invalid signature');

  const payment = await prisma.payment.update({
    where: { razorpay_order_id: data.razorpay_order_id },
    data: { status: 'paid', razorpay_payment_id: data.razorpay_payment_id },
  });

  await prisma.booking.update({
    where: { id: payment.booking_id },
    data: { status: 'confirmed' },
  });

  return payment;
}

export async function handleWebhook(rawBody: Buffer, signature: string) {
  const expected = crypto
    .createHmac('sha256', env.razorpay.webhookSecret)
    .update(rawBody)
    .digest('hex');

  if (expected !== signature) throw new Error('Invalid webhook signature');

  const event = JSON.parse(rawBody.toString());

  if (event.event === 'payment.captured') {
    const { order_id, id: payment_id } = event.payload.payment.entity;
    const payment = await prisma.payment.findUnique({ where: { razorpay_order_id: order_id } });
    if (payment && payment.status !== 'paid') {
      await prisma.payment.update({ where: { id: payment.id }, data: { status: 'paid', razorpay_payment_id: payment_id } });
      await prisma.booking.update({ where: { id: payment.booking_id }, data: { status: 'confirmed' } });
    }
  }
}
