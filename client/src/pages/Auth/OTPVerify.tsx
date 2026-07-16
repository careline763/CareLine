import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Beaker } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';
import { verifyOTP, sendOTP } from '../../services/auth.service';
import { useAuthStore } from '../../features/authStore';
import type { User } from '../../types';

export default function OTPVerify() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { phone: string; devOtp?: string } | null;
  const phone = state?.phone;
  const devOtp = state?.devOtp;        // present only when server has OTP_BYPASS=true
  const { setAuth } = useAuthStore();

  useEffect(() => {
    if (!phone) navigate('/login');
  }, [phone, navigate]);

  // Auto-fill OTP boxes when the server returned a dev_otp (bypass mode active).
  useEffect(() => {
    if (devOtp) setOtp(devOtp.split(''));
  }, []);

  useEffect(() => {
    if (resendTimer === 0) return;
    const t = setTimeout(() => setResendTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const handleChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) inputs.current[i - 1]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length !== 6) return toast.error('Enter the 6-digit OTP');
    setLoading(true);
    try {
      const { data } = await verifyOTP(phone, code);
      const result = (data as any)?.data;
      if (!result?.user || !result?.access_token) throw new Error('Invalid response');
      setAuth(result.user as User, result.access_token);
      toast.success('Login successful!');
      navigate('/');
    } catch {
      toast.error('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const res = await sendOTP(phone);
      const newDevOtp = (res.data as any)?.data?.dev_otp as string | undefined;
      setResendTimer(30);
      if (newDevOtp) {
        setOtp(newDevOtp.split(''));
        toast.success(`[DEV] OTP: ${newDevOtp}`, { duration: 20000 });
      } else {
        setOtp(['', '', '', '', '', '']);
        toast.success('OTP resent!');
      }
    } catch {
      toast.error('Could not resend OTP');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
      <div className="w-full max-w-sm">
        {/* DEV-ONLY banner — rendered only when server bypass is active */}
        {devOtp && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 mb-4">
            <Beaker size={15} className="text-amber-500 shrink-0" />
            <p className="text-xs text-amber-700 font-medium">
              Dev mode — OTP auto-filled: <span className="font-mono font-bold">{devOtp}</span>
            </p>
          </div>
        )}

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4">
            <ShieldCheck size={32} className="text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Verify OTP</h1>
          <p className="text-gray-500 text-sm mt-1">Sent to +91 {phone}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex gap-2 justify-center mb-6">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-11 h-12 text-center text-lg font-semibold border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
            ))}
          </div>

          <Button fullWidth size="lg" loading={loading} onClick={handleVerify}>
            Verify & Login
          </Button>

          <div className="text-center mt-4">
            {resendTimer > 0 ? (
              <p className="text-xs text-gray-400">Resend OTP in {resendTimer}s</p>
            ) : (
              <button onClick={handleResend} className="text-xs text-blue-600 font-medium hover:underline">
                Resend OTP
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
