import { NotificationType, Prisma } from '@prisma/client';
import prisma from '../../config/db';
import { sendSMS } from '../../utils/sms';
import { sendEmail, buildEmail } from '../../utils/email';
import { sendPush } from '../../utils/push';
import logger from '../../utils/logger';

// Which channels fire for each notification type
const CHANNEL_MAP: Record<NotificationType, { sms: boolean; email: boolean; push: boolean }> = {
  booking_confirmed:    { sms: true,  email: true,  push: true  },
  booking_assigned:     { sms: true,  email: false, push: true  },
  partner_en_route:     { sms: false, email: false, push: true  },
  booking_completed:    { sms: true,  email: true,  push: true  },
  booking_cancelled:    { sms: true,  email: true,  push: true  },
  subscription_reminder:{ sms: true,  email: false, push: true  },
  complaint_resolved:   { sms: true,  email: true,  push: true  },
  referral_reward:      { sms: true,  email: false, push: true  },
  payment_success:      { sms: false, email: true,  push: false },
  broadcast:            { sms: false, email: false, push: true  },
};

export interface NotifyPayload {
  title: string;
  body: string;
  data?: Record<string, unknown>;
  emailHtml?: string;          // override the auto-generated email body
  emailCta?: { label: string; url: string };
}

export async function notify(
  userId: number,
  type: NotificationType,
  payload: NotifyPayload
): Promise<void> {
  // 1. Always persist in-app notification
  await prisma.notification.create({
    data: {
      user_id: userId,
      type,
      title: payload.title,
      body: payload.body,
      data_json: payload.data != null ? (payload.data as Prisma.InputJsonValue) : Prisma.JsonNull,
    },
  });

  const channels = CHANNEL_MAP[type];
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { phone: true, email: true },
  });
  if (!user) return;

  const jobs: Promise<void>[] = [];

  // 2. SMS
  if (channels.sms && user.phone) {
    jobs.push(sendSMS(user.phone, `${payload.title}: ${payload.body}`));
  }

  // 3. Email
  if (channels.email && user.email) {
    const html = payload.emailHtml
      ?? buildEmail(payload.title, `<p>${payload.body}</p>`, payload.emailCta);
    jobs.push(sendEmail(user.email, payload.title, html));
  }

  // 4. Web Push
  if (channels.push) {
    const subs = await prisma.pushSubscription.findMany({ where: { user_id: userId } });
    for (const sub of subs) {
      jobs.push(
        sendPush(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          { title: payload.title, body: payload.body, data: payload.data }
        ).catch(async (err: unknown) => {
          // Remove expired subscriptions
          if ((err as { statusCode?: number }).statusCode === 410) {
            await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {});
          }
        })
      );
    }
  }

  await Promise.allSettled(jobs).then(results => {
    results.forEach(r => {
      if (r.status === 'rejected') logger.warn('[notify] Channel failed:', r.reason);
    });
  });
}

// Broadcast to many users (admin use)
export async function broadcast(
  userIds: number[],
  payload: NotifyPayload
): Promise<void> {
  await Promise.allSettled(userIds.map(id => notify(id, 'broadcast', payload)));
}

// ── In-app CRUD ──────────────────────────────────────────────────────
export const list = (userId: number, page = 1, limit = 30) =>
  prisma.notification.findMany({
    where: { user_id: userId },
    orderBy: { created_at: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
  });

export const unreadCount = (userId: number) =>
  prisma.notification.count({ where: { user_id: userId, read: false } });

export const markRead = (id: number, userId: number) =>
  prisma.notification.updateMany({ where: { id, user_id: userId }, data: { read: true } });

export const markAllRead = (userId: number) =>
  prisma.notification.updateMany({ where: { user_id: userId, read: false }, data: { read: true } });

// ── Push subscription management ─────────────────────────────────────
export const savePushSub = (userId: number, sub: {
  endpoint: string; p256dh: string; auth: string; device?: string;
}) =>
  prisma.pushSubscription.upsert({
    where: { endpoint: sub.endpoint.slice(0, 512) },
    update: { user_id: userId },
    create: { user_id: userId, endpoint: sub.endpoint.slice(0, 512), p256dh: sub.p256dh, auth: sub.auth, device: sub.device },
  });

export const deletePushSub = (userId: number, endpoint: string) =>
  prisma.pushSubscription.deleteMany({ where: { user_id: userId, endpoint: endpoint.slice(0, 512) } });
