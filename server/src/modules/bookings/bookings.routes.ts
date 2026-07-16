import { Router } from 'express';
import * as ctrl from './bookings.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { createBookingSchema, updateStatusSchema } from './bookings.validation';

const router = Router();
router.use(authenticate);

router.post('/', validate(createBookingSchema), ctrl.createBooking);
router.get('/', ctrl.listBookings);
router.get('/:id', ctrl.getBooking);
router.patch('/:id/status', validate(updateStatusSchema), ctrl.updateStatus);

export default router;
