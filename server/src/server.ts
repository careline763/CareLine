import http from 'http';
import app from './app';
import { env } from './config/env';
import prisma from './config/db';
import redis from './config/redis';
import { initSocket } from './sockets/tracking.socket';
import logger from './utils/logger';

const server = http.createServer(app);

initSocket(server);

// Workers are only loaded in production — dynamic imports prevent BullMQ from
// creating Redis connections at module load time when Redis isn't running.
let workerRefs: { close: () => Promise<void> }[] = [];

async function start() {
  try {
    await prisma.$connect();
    logger.info('Database connected');

    await redis.connect().catch((err: Error) => {
      logger.warn('Redis unavailable — background jobs disabled', { err: err.message });
    });

    if (env.nodeEnv === 'production') {
      // Dynamic imports: BullMQ Queue/Worker instances are created here, only
      // after Redis is confirmed available (or gracefully skipped above).
      const { scheduleAutoBookingJob, autoBookingWorker } = await import('./jobs/autoBooking.job');
      const { scheduleReminderJob, reminderWorker } = await import('./jobs/reminder.job');
      await scheduleAutoBookingJob();
      await scheduleReminderJob();
      workerRefs = [autoBookingWorker, reminderWorker];
    }

    server.listen(env.port, () => {
      logger.info(`Server running on port ${env.port} [${env.nodeEnv}]`);
    });
  } catch (err) {
    logger.error('Failed to start server', { err });
    process.exit(1);
  }
}

async function shutdown(signal: string) {
  logger.info(`${signal} received — shutting down`);
  await Promise.all(workerRefs.map((w) => w.close().catch(() => null)));
  await prisma.$disconnect();
  await redis.quit().catch(() => null);
  server.close(() => process.exit(0));
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

start();
