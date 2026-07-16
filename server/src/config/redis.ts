import Redis from 'ioredis';
import { env } from './env';
import logger from '../utils/logger';

const redis = new Redis(env.redisUrl, {
  // BullMQ requires this to be null. Commands simply queue when offline.
  maxRetriesPerRequest: null,
  // lazyConnect: true means no connection attempt until redis.connect() is called.
  lazyConnect: true,
  // In development: return null to stop retrying immediately after first failure.
  // In production: exponential back-off up to 10 s so the worker recovers
  // automatically if Redis restarts.
  retryStrategy: env.isDev
    ? () => null
    : (times) => Math.min(times * 1000, 10_000),
});

redis.on('connect', () => logger.info('Redis connected'));
// Only log the first error per connection attempt to avoid flooding the console.
redis.on('error', (err) => logger.warn(`Redis: ${err.message}`));

export default redis;
