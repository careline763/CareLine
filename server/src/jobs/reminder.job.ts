import { Queue, Worker, Job } from 'bullmq';
import { env } from '../config/env';
import prisma from '../config/db';
import logger from '../utils/logger';

const QUEUE_NAME = 'reminders';
const connection = { url: env.redisUrl };

export const reminderQueue = new Queue(QUEUE_NAME, { connection });

export async function scheduleReminderJob(): Promise<void> {
  await reminderQueue.add(
    'booking-reminders',
    {},
    {
      repeat: { pattern: '0 8 * * *' },
      removeOnComplete: true,
    }
  );
  logger.info('Reminder cron job scheduled (daily 8 AM)');
}

export const reminderWorker = new Worker(
  QUEUE_NAME,
  async (_job: Job) => {
    const in2Hours = new Date(Date.now() + 2 * 60 * 60 * 1000);
    const in3Hours = new Date(Date.now() + 3 * 60 * 60 * 1000);

    const upcoming = await prisma.booking.findMany({
      where: {
        scheduled_at: { gte: in2Hours, lte: in3Hours },
        status: { in: ['confirmed', 'assigned'] },
      },
      include: { user: true, partner: { include: { user: true } } },
    });

    for (const booking of upcoming) {
      // In production: send push notification / SMS via MSG91
      logger.info(`[Reminder] Booking #${booking.id} for ${booking.user.phone} in ~2 hours`);
    }
  },
  { connection }
);

reminderWorker.on('failed', (job, err) => logger.error(`Reminder job ${job?.id} failed`, { err }));
