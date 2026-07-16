import logger from './logger';

const AUTH_KEY  = process.env.MSG91_AUTH_KEY;
const SENDER_ID = process.env.MSG91_SENDER_ID || 'SPKWSH';

// NOTE: This function is NOT called when OTP_BYPASS=true.
// The bypass in auth.service.ts#initOTP short-circuits before reaching here,
// so no SMS is attempted during development testing sessions.
export async function sendSMS(phone: string, message: string): Promise<void> {
  if (!AUTH_KEY) {
    logger.info(`[SMS-stub] No MSG91 key configured — +91${phone}: ${message}`);
    return;
  }
  try {
    const res = await fetch('https://api.msg91.com/api/v2/sendsms', {
      method: 'POST',
      headers: { authkey: AUTH_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender: SENDER_ID,
        route: '4',
        country: '91',
        sms: [{ message, to: [`91${phone}`] }],
      }),
    });
    if (!res.ok) logger.warn(`[SMS] Non-OK response ${res.status} for ${phone}`);
  } catch (err) {
    logger.error('[SMS] Send failed:', err);
  }
}
