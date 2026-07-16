import nodemailer from 'nodemailer';
import logger from './logger';

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST || 'smtp.gmail.com',
  port:   Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM = `"SparkWash" <${process.env.SMTP_USER || 'noreply@sparkwash.in'}>`;

export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  if (!process.env.SMTP_USER) {
    logger.info(`[Email-stub] To: ${to} | Subject: ${subject}`);
    return;
  }
  try {
    await transporter.sendMail({ from: FROM, to, subject, html });
  } catch (err) {
    logger.error(`[Email] Failed to send to ${to}:`, err);
  }
}

// ── HTML template builder ────────────────────────────────────────────
export function buildEmail(title: string, body: string, cta?: { label: string; url: string }): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<style>body{margin:0;font-family:Inter,Arial,sans-serif;background:#f1f5f9;color:#1e293b}
.card{max-width:560px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)}
.header{background:#2563eb;padding:28px 32px;text-align:center}
.header h1{margin:0;color:#fff;font-size:22px;font-weight:700;letter-spacing:-.3px}
.header p{margin:4px 0 0;color:#93c5fd;font-size:13px}
.body{padding:28px 32px}
.body p{margin:0 0 16px;font-size:15px;line-height:1.6;color:#374151}
.cta{display:inline-block;margin:8px 0 4px;padding:12px 28px;background:#2563eb;color:#fff;border-radius:10px;font-size:14px;font-weight:600;text-decoration:none}
.footer{background:#f8fafc;padding:16px 32px;text-align:center;font-size:12px;color:#94a3b8;border-top:1px solid #e2e8f0}
</style></head><body>
<div class="card">
  <div class="header"><h1>SparkWash</h1><p>Doorstep Car Cleaning</p></div>
  <div class="body">
    <p><strong>${title}</strong></p>
    ${body}
    ${cta ? `<p><a class="cta" href="${cta.url}">${cta.label}</a></p>` : ''}
  </div>
  <div class="footer">SparkWash · Doorstep Car Cleaning · India<br/>You received this because you booked with SparkWash.</div>
</div>
</body></html>`;
}
