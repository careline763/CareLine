import dotenv from 'dotenv';
dotenv.config();

function required(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing env var: ${key}`);
  return val;
}

// ── OTP BYPASS SAFETY RULE ────────────────────────────────────────────────────
// otpBypass is ONLY true when ALL of the following are simultaneously met:
//   1. NODE_ENV is not "production"   ← enforced at runtime, cannot be spoofed
//   2. OTP_BYPASS env var is "true"   ← explicit opt-in, off by default
//
// This means: even if someone accidentally commits OTP_BYPASS=true to a
// production .env file, NODE_ENV=production in the server process will always
// override it and keep the bypass disabled. Two independent gates must both
// pass; one gate alone is never enough.
// ─────────────────────────────────────────────────────────────────────────────
const isProduction = process.env.NODE_ENV === 'production';
const otpBypassRequested = process.env.OTP_BYPASS === 'true';
const otpBypass = !isProduction && otpBypassRequested;

if (otpBypass) {
  console.warn(
    '\n⚠️  [OTP-BYPASS] Development OTP bypass is ACTIVE.' +
    '\n    Test OTP is: 123456' +
    '\n    SMS will NOT be sent for any login request.' +
    '\n    THIS MUST NEVER RUN IN PRODUCTION.\n'
  );
}

export const env = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isDev: !isProduction,

  // ── DEV/STAGING ONLY ──────────────────────────────────────────────────────
  // Always false in production. Controls the OTP testing shortcut.
  // See server/src/modules/auth/auth.service.ts for where this is consumed.
  // ─────────────────────────────────────────────────────────────────────────
  otpBypass,

  databaseUrl: required('DATABASE_URL'),
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',

  jwt: {
    accessSecret: required('JWT_ACCESS_SECRET'),
    refreshSecret: required('JWT_REFRESH_SECRET'),
    accessExpires: process.env.JWT_ACCESS_EXPIRES || '15m',
    refreshExpires: process.env.JWT_REFRESH_EXPIRES || '7d',
  },

  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || '',
  },

  msg91: {
    authKey: process.env.MSG91_AUTH_KEY || '',
    templateId: process.env.MSG91_TEMPLATE_ID || '',
  },

  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};
