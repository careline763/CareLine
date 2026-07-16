import webpush from 'web-push';
import logger from './logger';

if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    `mailto:${process.env.VAPID_EMAIL || 'admin@sparkwash.in'}`,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY,
  );
}

export interface PushSub {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}

export async function sendPush(
  sub: PushSub,
  payload: { title: string; body: string; icon?: string; data?: object }
): Promise<void> {
  if (!process.env.VAPID_PUBLIC_KEY) {
    logger.info(`[Push-stub] ${payload.title}: ${payload.body}`);
    return;
  }
  try {
    await webpush.sendNotification(
      sub,
      JSON.stringify({ ...payload, icon: payload.icon || '/icons.svg' })
    );
  } catch (err: unknown) {
    // 410 Gone = subscription expired, caller should delete it
    if ((err as { statusCode?: number }).statusCode !== 410) {
      logger.error('[Push] Send failed:', err);
    }
    throw err;
  }
}

export const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY ?? '';
