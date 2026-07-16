import { Router, Request, Response } from 'express';
import * as service from './payments.service';
import { ok, badRequest } from '../../utils/response';
import logger from '../../utils/logger';

const router = Router();

// Called from frontend after Razorpay checkout success
router.post('/confirm', async (req: Request, res: Response) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  try {
    const payment = await service.confirmPayment({ razorpay_order_id, razorpay_payment_id, razorpay_signature });
    ok(res, payment, 'Payment confirmed');
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Payment confirmation failed';
    badRequest(res, msg);
  }
});

// Razorpay webhook (use raw body for signature verification)
router.post('/webhook', async (req: Request, res: Response) => {
  const signature = req.headers['x-razorpay-signature'] as string;
  try {
    await service.handleWebhook(req.body as Buffer, signature);
    res.status(200).json({ received: true });
  } catch (err) {
    logger.error('Webhook error', { err });
    res.status(400).json({ error: 'Invalid webhook' });
  }
});

export default router;
