import prisma from '../../config/db';
import { env } from '../../config/env';
import { generateOTP, otpExpiresAt, sendOTP as dispatchOTP } from '../../utils/otp';
import { signAccessToken, signRefreshToken } from '../../utils/jwt';
import logger from '../../utils/logger';

// ── DEV/STAGING TEST OTP ──────────────────────────────────────────────────────
// Used only when env.otpBypass === true (requires NODE_ENV !== 'production').
// This constant is referenced in initOTP and verifyAndLogin below.
// Search for "DEV-ONLY" comments to find every place the bypass touches.
// ─────────────────────────────────────────────────────────────────────────────
const DEV_TEST_OTP = '123456';

export async function initOTP(phone: string): Promise<string | undefined> {
  // ── DEV-ONLY: OTP bypass ──────────────────────────────────────────────────
  // When OTP_BYPASS=true and NODE_ENV !== 'production':
  //   • Stores the fixed test OTP (123456) in the DB instead of a random one.
  //   • Skips SMS dispatch entirely — no MSG91 call is made.
  //   • Returns the test OTP so the controller can include it in the response.
  //
  // env.otpBypass is always false in production (see config/env.ts), so this
  // entire block is unreachable in a production process even if the env var
  // is accidentally present in a production .env file.
  // ─────────────────────────────────────────────────────────────────────────
  if (env.otpBypass) {
    await prisma.user.upsert({
      where: { phone },
      update: { otp: DEV_TEST_OTP, otp_expires: otpExpiresAt(60) },
      create: { phone, name: 'User', otp: DEV_TEST_OTP, otp_expires: otpExpiresAt(60) },
    });
    logger.warn(
      `[OTP-BYPASS] Stored test OTP ${DEV_TEST_OTP} for +91${phone}. ` +
      'SMS skipped. Disable OTP_BYPASS before deploying to production.'
    );
    return DEV_TEST_OTP;
  }
  // ── END DEV-ONLY ──────────────────────────────────────────────────────────

  // Production path: generate a cryptographically random 6-digit OTP,
  // persist it with a 10-minute expiry, then dispatch via MSG91.
  const otp = generateOTP();
  const expires = otpExpiresAt(10);

  await prisma.user.upsert({
    where: { phone },
    update: { otp, otp_expires: expires },
    create: { phone, name: 'User', otp, otp_expires: expires },
  });

  await dispatchOTP(phone, otp);
  // Return value is undefined in production — the caller (controller) will
  // not include a dev_otp field in the response.
}

export async function verifyAndLogin(phone: string, otp: string, name?: string) {
  const user = await prisma.user.findUnique({ where: { phone } });

  if (!user) throw new Error('OTP not requested');

  // ── DEV-ONLY: OTP bypass ──────────────────────────────────────────────────
  // When OTP_BYPASS=true and the submitted OTP is the test value (123456):
  //   • Skips DB OTP value comparison.
  //   • Skips OTP expiry check.
  //   • The user record must still exist (initOTP must have been called first).
  //
  // In production env.otpBypass is always false, so isBypassOtp is always
  // false and this path is never taken — all production logins go through the
  // full validation below.
  // ─────────────────────────────────────────────────────────────────────────
  const isBypassOtp = env.otpBypass && otp === DEV_TEST_OTP;

  if (!isBypassOtp) {
    // Production validation: OTP must exist, match, and not be expired.
    if (!user.otp || !user.otp_expires) throw new Error('OTP not requested');
    if (user.otp !== otp) throw new Error('Invalid OTP');
    if (user.otp_expires < new Date()) throw new Error('OTP expired');
  }
  // ── END DEV-ONLY ──────────────────────────────────────────────────────────

  // Clear the OTP from DB regardless of which path was taken.
  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      otp: null,
      otp_expires: null,
      ...(name && !user.name.startsWith('User') ? {} : name ? { name } : {}),
    },
  });

  const payload = { userId: updated.id, role: updated.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  await prisma.refreshToken.create({
    data: {
      user_id: updated.id,
      token: refreshToken,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    user: {
      id: updated.id,
      name: updated.name,
      phone: updated.phone,
      email: updated.email,
      role: updated.role,
    },
  };
}

export async function refreshTokens(token: string) {
  const { verifyRefreshToken } = await import('../../utils/jwt');
  const payload = verifyRefreshToken(token);

  const stored = await prisma.refreshToken.findUnique({ where: { token } });
  if (!stored || stored.expires_at < new Date()) throw new Error('Invalid refresh token');

  await prisma.refreshToken.delete({ where: { token } });

  const newPayload = { userId: payload.userId, role: payload.role };
  const accessToken = signAccessToken(newPayload);
  const refreshToken = signRefreshToken(newPayload);

  await prisma.refreshToken.create({
    data: {
      user_id: payload.userId,
      token: refreshToken,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return { access_token: accessToken, refresh_token: refreshToken };
}

export async function getMe(userId: number) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, phone: true, email: true, role: true, created_at: true },
  });
}
