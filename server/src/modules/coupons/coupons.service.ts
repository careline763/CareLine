import prisma from '../../config/db';

export const list = () =>
  prisma.coupon.findMany({ orderBy: { created_at: 'desc' } });

export const create = (data: {
  code: string; discount_type: 'flat' | 'percent'; value: number;
  valid_till: string; max_uses?: number; min_order_amount?: number;
  max_discount?: number; first_booking_only?: boolean;
}) =>
  prisma.coupon.create({
    data: {
      ...data,
      valid_till: new Date(data.valid_till),
    },
  });

export const toggle = (id: number, is_active: boolean) =>
  prisma.coupon.update({ where: { id }, data: { is_active } });

export const apply = async (code: string, userId: number, orderAmount: number) => {
  const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });

  if (!coupon) return { valid: false, message: 'Invalid coupon code' };
  if (!coupon.is_active) return { valid: false, message: 'Coupon is inactive' };
  if (new Date() > coupon.valid_till) return { valid: false, message: 'Coupon has expired' };
  if (coupon.used_count >= coupon.max_uses) return { valid: false, message: 'Coupon usage limit reached' };
  if (coupon.min_order_amount && orderAmount < Number(coupon.min_order_amount)) {
    return { valid: false, message: `Minimum order ₹${coupon.min_order_amount} required` };
  }

  if (coupon.first_booking_only) {
    const priorBooking = await prisma.booking.findFirst({
      where: { user_id: userId, status: { notIn: ['pending_payment', 'cancelled'] } },
    });
    if (priorBooking) return { valid: false, message: 'Coupon valid for first booking only' };
  }

  let discount = 0;
  if (coupon.discount_type === 'flat') {
    discount = Number(coupon.value);
  } else {
    discount = (orderAmount * Number(coupon.value)) / 100;
    if (coupon.max_discount) discount = Math.min(discount, Number(coupon.max_discount));
  }
  discount = Math.min(discount, orderAmount);

  return { valid: true, coupon_id: coupon.id, discount, message: `₹${discount} discount applied` };
};

export const markUsed = (id: number) =>
  prisma.coupon.update({ where: { id }, data: { used_count: { increment: 1 } } });
