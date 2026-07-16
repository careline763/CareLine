import prisma from '../../config/db';
import crypto from 'crypto';
import { notify } from '../notifications/notifications.service';

const REFERRAL_REWARD = 100; // ₹100 wallet credit
const FIRST_BOOKING_DISCOUNT = 50; // ₹50 off first booking

function generateCode(name: string): string {
  const base = name.replace(/\s+/g, '').toUpperCase().slice(0, 5);
  const rand = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `${base}${rand}`;
}

export const getOrCreateCode = async (userId: number) => {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  if (user.referral_code) return { referral_code: user.referral_code };

  const code = generateCode(user.name);
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { referral_code: code },
  });
  return { referral_code: updated.referral_code };
};

export const applyReferral = async (referralCode: string, newUserId: number) => {
  const referrer = await prisma.user.findUnique({ where: { referral_code: referralCode } });
  if (!referrer) return { valid: false, message: 'Referral code not found' };
  if (referrer.id === newUserId) return { valid: false, message: 'Cannot use your own referral code' };

  // Check not already referred
  const existing = await prisma.referral.findFirst({ where: { referred_id: newUserId } });
  if (existing) return { valid: false, message: 'You have already used a referral code' };

  await prisma.referral.create({
    data: {
      referrer_id: referrer.id,
      referred_id: newUserId,
      reward_status: 'pending',
      reward_amount: REFERRAL_REWARD,
    },
  });

  return {
    valid: true,
    message: `Referral applied! You get ₹${FIRST_BOOKING_DISCOUNT} off your first booking.`,
    discount: FIRST_BOOKING_DISCOUNT,
  };
};

// Called after referred user completes first booking
export const settleReferralReward = async (userId: number) => {
  const referral = await prisma.referral.findFirst({
    where: { referred_id: userId, reward_status: 'pending' },
  });
  if (!referral) return;

  await prisma.$transaction([
    prisma.referral.update({
      where: { id: referral.id },
      data: { reward_status: 'paid', rewarded_at: new Date() },
    }),
    prisma.user.update({
      where: { id: referral.referrer_id },
      data: { wallet_balance: { increment: referral.reward_amount ?? REFERRAL_REWARD } },
    }),
  ]);

  const amount = Number(referral.reward_amount ?? REFERRAL_REWARD);
  notify(referral.referrer_id, 'referral_reward', {
    title: 'Referral Reward Credited!',
    body: `₹${amount} has been added to your SparkWash wallet. Your friend just completed their first wash!`,
    data: { amount },
  }).catch(() => {});
};

export const listByUser = (userId: number) =>
  prisma.referral.findMany({
    where: { referrer_id: userId },
    include: { referred: { select: { name: true, phone: true, created_at: true } } },
    orderBy: { created_at: 'desc' },
  });

export const listAll = () =>
  prisma.referral.findMany({
    include: {
      referrer: { select: { id: true, name: true, phone: true } },
      referred: { select: { id: true, name: true, phone: true } },
    },
    orderBy: { created_at: 'desc' },
  });
