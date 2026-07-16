import { Queue, Worker, Job } from 'bullmq';
import { env } from '../config/env';
import prisma from '../config/db';
import logger from '../utils/logger';

const QUEUE_NAME = 'auto-booking';
const connection = { url: env.redisUrl };

export const autoBookingQueue = new Queue(QUEUE_NAME, { connection });

export async function scheduleAutoBookingJob(): Promise<void> {
  await autoBookingQueue.add(
    'daily-auto-book',
    {},
    {
      repeat: { pattern: '0 6 * * *' },
      removeOnComplete: true,
      removeOnFail: 100,
    }
  );
  logger.info('Auto-booking cron job scheduled (daily 6 AM)');
}

export const autoBookingWorker = new Worker(
  QUEUE_NAME,
  async (_job: Job) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dueSubs = await prisma.subscription.findMany({
      where: {
        status: 'active',
        next_billing_date: { gte: today, lt: tomorrow },
      },
      include: { user: { include: { vehicles: true } }, plan: true },
    });

    logger.info(`Auto-booking: ${dueSubs.length} subscriptions due today`);

    for (const sub of dueSubs) {
      const vehicle = sub.user.vehicles[0];
      if (!vehicle) {
        logger.warn(`Auto-booking skipped: user ${sub.user_id} has no vehicle`);
        continue;
      }

      // Determine slot time (8 AM tomorrow)
      const slot = new Date(tomorrow);
      slot.setHours(8, 0, 0, 0);

      const nearestPartner = await prisma.partner.findFirst({
        where: {
          verification_status: 'approved',
          is_available: true,
          ...(sub.pincode ? { current_pincode: sub.pincode } : {}),
        },
        orderBy: { rating_avg: 'desc' },
      });

      await prisma.booking.create({
        data: {
          user_id: sub.user_id,
          vehicle_id: vehicle.id,
          plan_id: sub.plan_id,
          society_id: sub.society_id ?? undefined,
          partner_id: nearestPartner?.id,
          address: sub.address ?? 'Address not set — contact customer',
          pincode: sub.pincode ?? '000000',
          scheduled_at: slot,
          total_amount: sub.plan.price,
          status: nearestPartner ? 'assigned' : 'confirmed',
          notes: `Auto-created from subscription #${sub.id}`,
        },
      });

      // Advance next_billing_date based on plan frequency
      const next = new Date(sub.next_billing_date);
      if (sub.plan.frequency === 'weekly' || sub.plan.type === 'weekly') {
        next.setDate(next.getDate() + 7);
      } else {
        next.setMonth(next.getMonth() + 1);
      }

      await prisma.subscription.update({
        where: { id: sub.id },
        data: { next_billing_date: next },
      });

      logger.info(`Auto-booking created for sub #${sub.id} → user ${sub.user_id}`);
    }
  },
  { connection }
);

autoBookingWorker.on('completed', (job) => logger.info(`Auto-booking job ${job.id} done`));
autoBookingWorker.on('failed', (job, err) => logger.error(`Auto-booking job ${job?.id} failed`, { err }));
