import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, RefreshCw, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
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
  const devOtp = state?.devOtp;
  const { setAuth } = useAuthStore();

  useEffect(() => {
    if (!phone) navigate('/login');
  }, [phone, navigate]);

  useEffect(() => {
    if (devOtp) setOtp(devOtp.split(''));
  }, [devOtp]);

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

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length === 6) {
      setOtp(pastedData.split(''));
      inputs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length !== 6) return toast.error('Enter the 6-digit OTP');
    setLoading(true);
    try {
      const { data } = await verifyOTP(phone!, code);
      const result = (data as any)?.data;
      if (!result?.user || !result?.access_token) throw new Error('Invalid response');
      setAuth(result.user as User, result.access_token);
      toast.success('Welcome to CareLine! 🎉');
      navigate('/');
    } catch {
      toast.error('Invalid OTP. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const res = await sendOTP(phone!);
      const newDevOtp = (res.data as any)?.data?.dev_otp as string | undefined;
      setResendTimer(30);
      if (newDevOtp) {
        setOtp(newDevOtp.split(''));
        toast.success(`[DEV] OTP: ${newDevOtp}`, { duration: 20000 });
      } else {
        setOtp(['', '', '', '', '', '']);
        toast.success('New OTP sent to your phone!');
      }
      inputs.current[0]?.focus();
    } catch {
      toast.error('Could not resend OTP. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-luxuryDark-base relative overflow-hidden flex items-center justify-center px-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-luxuryGold/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-luxuryGold/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(197,168,128,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(197,168,128,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 text-gray-400 hover:text-luxuryGold transition-colors mb-6 text-sm group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Login</span>
        </button>

        {/* Dev Mode Banner */}
        {devOtp && (
          <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-sm px-4 py-3 mb-6 animate-[fadeIn_0.3s_ease]">
            <Sparkles size={16} className="text-amber-400 flex-shrink-0 animate-pulse" />
            <p className="text-xs text-amber-300 font-medium">
              Dev Mode: OTP auto-filled <span className="font-mono font-bold">{devOtp}</span>
            </p>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-luxuryDark-card border border-luxuryDark-border rounded-sm p-8 shadow-2xl shadow-black/40 backdrop-blur-sm">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/10 rounded-sm mb-4 border border-green-500/30">
              <ShieldCheck size={32} className="text-green-400" />
            </div>
            <h1 className="font-serif text-2xl text-white font-normal tracking-wide mb-2">Verify Your Number</h1>
            <p className="text-sm text-gray-400">
              We sent a code to <span className="text-luxuryGold font-medium">+91 {phone}</span>
            </p>
          </div>

          {/* OTP Input Boxes */}
          <div className="flex gap-3 justify-center mb-8" onPaste={handlePaste}>
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
                className="w-12 h-14 text-center text-2xl font-bold bg-luxuryDark-input border-2 border-luxuryDark-border text-luxuryGold rounded-sm focus:outline-none focus:border-luxuryGold focus:ring-2 focus:ring-luxuryGold/20 transition-all"
              />
            ))}
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={loading || otp.join('').length !== 6}
            className="w-full py-4 bg-luxuryGold hover:bg-luxuryGold-light text-black text-sm font-bold tracking-widest uppercase rounded-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-luxuryGold/20 hover:shadow-luxuryGold/40 flex items-center justify-center gap-2 mb-6"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <ShieldCheck size={18} />
                <span>Verify & Continue</span>
              </>
            )}
          </button>

          {/* Resend Section */}
          <div className="text-center">
            {resendTimer > 0 ? (
              <p className="text-xs text-gray-500">
                Resend code in <span className="text-luxuryGold font-mono font-bold">{resendTimer}s</span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                className="text-sm text-luxuryGold hover:text-luxuryGold-light font-medium flex items-center gap-2 mx-auto group"
              >
                <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
                <span>Resend OTP</span>
              </button>
            )}
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-luxuryDark-border/60"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-luxuryDark-card px-6 text-gray-600 tracking-[0.3em] font-bold text-xs uppercase" style={{ 
                backgroundImage: 'linear-gradient(transparent calc(50% - 0.5px), rgba(197, 168, 128, 0.4) calc(50% - 0.5px), rgba(197, 168, 128, 0.4) calc(50% + 0.5px), transparent calc(50% + 0.5px))'
              }}>
                Secure
              </span>
            </div>
          </div>

          {/* Help Text */}
          <p className="text-xs text-gray-600 text-center leading-relaxed">
            Didn't receive the code? Check your SMS inbox or try resending.
          </p>
        </div>

        {/* Support Link */}
        <p className="text-center text-xs text-gray-600 mt-6">
          Having trouble? <a href="mailto:support@careline.in" className="text-luxuryGold hover:text-luxuryGold-light underline">Contact Support</a>
        </p>
      </div>
    </div>
  );
}
