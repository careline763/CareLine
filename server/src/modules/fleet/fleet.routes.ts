import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/role.middleware';
import * as svc from './fleet.service';

const router = Router();
router.use(authenticate);

// Admin-only fleet management
router.get('/', requireRole('admin'), async (_req, res, next) => {
  try { res.json({ success: true, data: await svc.listFleets() }); }
  catch (err) { next(err); }
});

router.post('/', requireRole('admin'), async (req, res, next) => {
  try { res.status(201).json({ success: true, data: await svc.createFleet(req.body) }); }
  catch (err) { next(err); }
});

router.get('/:id', requireRole('admin'), async (req, res, next) => {
  try { res.json({ success: true, data: await svc.getFleet(Number(req.params.id)) }); }
  catch (err) { next(err); }
});

router.patch('/:id', requireRole('admin'), async (req, res, next) => {
  try { res.json({ success: true, data: await svc.updateFleet(Number(req.params.id), req.body) }); }
  catch (err) { next(err); }
});

router.post('/:id/members', requireRole('admin'), async (req, res, next) => {
  try {
    const { user_id, role } = req.body;
    res.status(201).json({ success: true, data: await svc.addMember(Number(req.params.id), user_id, role) });
  } catch (err) { next(err); }
});

router.delete('/:id/members/:userId', requireRole('admin'), async (req, res, next) => {
  try {
    await svc.removeMember(Number(req.params.id), Number(req.params.userId));
    res.json({ success: true });
  } catch (err) { next(err); }
});

router.post('/:id/vehicles', requireRole('admin'), async (req, res, next) => {
  try {
    res.status(201).json({ success: true, data: await svc.addVehicle(Number(req.params.id), req.body.vehicle_id) });
  } catch (err) { next(err); }
});

router.delete('/vehicles/:vehicleId', requireRole('admin'), async (req, res, next) => {
  try { await svc.removeVehicle(Number(req.params.vehicleId)); res.json({ success: true }); }
  catch (err) { next(err); }
});

// Fleet bookings — accessible by fleet_manager too
router.get('/:id/bookings', async (req, res, next) => {
  try {
    const page = Number(req.query.page ?? 1);
    res.json({ success: true, data: await svc.listFleetBookings(Number(req.params.id), page) });
  } catch (err) { next(err); }
});

// Invoice generation
router.post('/:id/invoices', requireRole('admin'), async (req, res, next) => {
  try {
    const { period_start, period_end } = req.body;
    const inv = await svc.generateInvoice(
      Number(req.params.id), new Date(period_start), new Date(period_end)
    );
    res.status(201).json({ success: true, data: inv });
  } catch (err) { next(err); }
});

router.get('/:id/invoices', async (req, res, next) => {
  try { res.json({ success: true, data: await svc.listInvoices(Number(req.params.id)) }); }
  catch (err) { next(err); }
});

router.patch('/invoices/:invoiceId/status', requireRole('admin'), async (req, res, next) => {
  try {
    const inv = await svc.updateInvoiceStatus(Number(req.params.invoiceId), req.body.status);
    res.json({ success: true, data: inv });
  } catch (err) { next(err); }
});

export default router;
