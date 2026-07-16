import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { errorHandler } from './middlewares/error.middleware';

// Route modules
import authRoutes from './modules/auth/auth.routes';
import plansRoutes from './modules/plans/plans.routes';
import servicesRoutes from './modules/plans/services.routes';
import serviceAreasRoutes from './modules/plans/serviceAreas.routes';
import vehiclesRoutes from './modules/vehicles/vehicles.routes';
import bookingsRoutes from './modules/bookings/bookings.routes';
import paymentsRoutes from './modules/payments/payments.routes';
import subscriptionsRoutes from './modules/subscriptions/subscriptions.routes';
import partnersRoutes from './modules/partners/partners.routes';
import reviewsRoutes from './modules/reviews/reviews.routes';
import societiesRoutes from './modules/societies/societies.routes';
import complaintsRoutes from './modules/complaints/complaints.routes';
import couponsRoutes from './modules/coupons/coupons.routes';
import referralsRoutes from './modules/referrals/referrals.routes';
import uploadsRoutes from './modules/uploads/uploads.routes';
import pricingRoutes from './modules/pricing/pricing.routes';
import gpsRoutes from './modules/gps/gps.routes';
import fleetRoutes from './modules/fleet/fleet.routes';
import notificationsRoutes from './modules/notifications/notifications.routes';

const app = express();

// Security headers
app.use(helmet());

// CORS
app.use(cors({
  origin: [
    env.clientUrl,
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
    'http://localhost:5177',
  ],
  credentials: true,
}));

// Serve uploaded files as static
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Raw body for Razorpay webhook BEFORE json parser
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

// JSON body parser
app.use(express.json());

// Global rate limit
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok', env: env.nodeEnv }));

// Core API routes
app.use('/api/auth', authRoutes);
app.use('/api/plans', plansRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/service-areas', serviceAreasRoutes);
app.use('/api/vehicles', vehiclesRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/subscriptions', subscriptionsRoutes);
app.use('/api/partners', partnersRoutes);
app.use('/api/reviews', reviewsRoutes);

// Phase 2 routes
app.use('/api/societies', societiesRoutes);
app.use('/api/complaints', complaintsRoutes);
app.use('/api/coupons', couponsRoutes);
app.use('/api/referrals', referralsRoutes);
app.use('/api/uploads', uploadsRoutes);
app.use('/api/pricing', pricingRoutes);

// Phase 4 routes
app.use('/api/gps', gpsRoutes);
app.use('/api/fleet', fleetRoutes);

// Phase 5 routes
app.use('/api/notifications', notificationsRoutes);

// Dev-only: set a user's role for testing (disabled in production)
if (env.isDev) {
  app.post('/api/dev/set-role', async (req, res) => {
    const { phone, role } = req.body as { phone: string; role: string };
    const validRoles = ['customer', 'partner', 'admin', 'fleet_manager'];
    if (!phone || !validRoles.includes(role)) {
      res.status(400).json({ success: false, message: 'Provide phone and role (customer|partner|admin|fleet_manager)' });
      return;
    }
    const db = (await import('./config/db')).default;
    const user = await db.user.update({ where: { phone }, data: { role: role as any } });
    res.json({ success: true, data: { id: user.id, phone: user.phone, role: user.role } });
  });
}

// 404
app.use((_req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

// Global error handler
app.use(errorHandler);

export default app;
