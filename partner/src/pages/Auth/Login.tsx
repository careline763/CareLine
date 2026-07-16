import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, ShieldCheck, ChevronRight, Beaker, Sparkles, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import type { User } from '../../types';

type Step = 'phone' | 'otp';

export default function Login() {
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [devOtp, setDevOtp] = useState<string | undefined>(undefined);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) return toast.error('Enter a valid 10-digit phone number');
    setLoading(true);
    try {
      const res = await api.post('/auth/otp/send', { phone });
      const bypass = (res.data as any)?.data?.dev_otp as string | undefined;
      if (bypass) {
        setDevOtp(bypass);
        setOtp(bypass.split(''));
        toast.success(`[DEV] OTP: ${bypass}`, { duration: 20000 });
      } else {
        toast.success('OTP sent!');
      }
      setStep('otp');
      setTimer(30);
      const interval = setInterval(() => setTimer(t => { if (t <= 1) { clearInterval(interval); return 0; } return t - 1; }), 1000);
    } catch { toast.error('Failed to send OTP'); }
    finally { setLoading(false); }
  };

  const handleOtpChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp]; next[i] = val; setOtp(next);
    if (val && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleOtpKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) inputs.current[i - 1]?.focus();
  };

  const verifyOtp = async () => {
    const code = otp.join('');
    if (code.length !== 6) return toast.error('Enter the 6-digit OTP');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/otp/verify', { phone, otp: code });
      let u = data.data.user as User;
      if (u.role !== 'partner') {
        if (devOtp) {
          await api.post('/dev/set-role', { phone, role: 'partner' });
          u = { ...u, role: 'partner' };
          toast.success('[DEV] Promoted to partner for testing');
        } else {
          toast.error('This app is for partners only.');
          return;
        }
      }
      setAuth(u, data.data.access_token);
      toast.success('Welcome back!');
      navigate('/jobs');
    } catch { toast.error('Invalid OTP. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-dvh flex bg-white">
      {/* Left brand panel — desktop only */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center text-white px-12 overflow-hidden bg-gradient-to-br from-sky-500 via-sky-600 to-indigo-700">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-8 right-8 w-48 h-48 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute top-32 left-4 w-32 h-32 rounded-full bg-indigo-400/20 blur-2xl" />
          <div className="absolute bottom-48 right-0 w-40 h-40 rounded-full bg-sky-300/10 blur-3xl" />
        </div>

        <div className="relative flex flex-col items-center text-center">
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-white/15 backdrop-blur rounded-3xl flex items-center justify-center ring-4 ring-white/20 shadow-2xl">
              <Car size={44} className="text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-7 h-7 bg-amber-400 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles size={14} className="text-white" />
            </div>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight mb-1">SparkWash</h1>
          <p className="text-sky-100 text-sm font-semibold tracking-wide uppercase">Partner Portal</p>
          <p className="text-sky-100/80 text-sm mt-5 max-w-xs leading-relaxed">
            Manage jobs, track earnings, and grow with India's fastest-growing doorstep car care network.
          </p>

          <div className="flex flex-wrap gap-2 justify-center mt-6">
            {['Instant Jobs', 'GPS Tracking', 'Daily Earnings'].map(tag => (
              <span key={tag} className="flex items-center gap-1.5 bg-white/15 backdrop-blur px-3 py-1.5 rounded-full text-xs text-white/90 font-semibold">
                <Zap size={10} className="text-amber-300" /> {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right column — form */}
      <div className="flex-1 flex flex-col min-h-dvh lg:bg-gray-50">
        {/* Mobile hero (hidden on desktop) */}
        <div className="lg:hidden relative flex flex-col items-center justify-center text-white px-5 pt-14 pb-8 bg-gradient-to-br from-sky-500 via-sky-600 to-indigo-700 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-8 right-8 w-48 h-48 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute top-32 left-4 w-32 h-32 rounded-full bg-indigo-400/20 blur-2xl" />
            <div className="absolute bottom-48 right-0 w-40 h-40 rounded-full bg-sky-300/10 blur-3xl" />
          </div>
          <div className="relative flex flex-col items-center">
            <div className="relative mb-6">
              <div className="w-24 h-24 bg-white/15 backdrop-blur rounded-3xl flex items-center justify-center ring-4 ring-white/20 shadow-2xl">
                <Car size={44} className="text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-7 h-7 bg-amber-400 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles size={14} className="text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-1">SparkWash</h1>
            <p className="text-sky-100 text-sm font-semibold tracking-wide uppercase">Partner Portal</p>
            <div className="flex flex-wrap gap-2 justify-center mt-6">
              {['Instant Jobs', 'GPS Tracking', 'Daily Earnings'].map(tag => (
                <span key={tag} className="flex items-center gap-1.5 bg-white/15 backdrop-blur px-3 py-1.5 rounded-full text-xs text-white/90 font-semibold">
                  <Zap size={10} className="text-amber-300" /> {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Form card */}
        <div className="flex-1 flex items-center justify-center px-5 sm:px-10 py-8">
          <div className="relative w-full max-w-sm bg-white rounded-t-[2rem] lg:rounded-3xl px-5 lg:px-8 pt-7 pb-10 lg:py-9 shadow-2xl lg:shadow-xl lg:border lg:border-gray-100 -mt-6 lg:mt-0">
            {/* Handle */}
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6 lg:hidden" />

            {step === 'phone' ? (
              <>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Welcome back</h2>
                <p className="text-gray-400 text-sm mb-6">Sign in to your partner account</p>

                <form onSubmit={sendOtp} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Phone Number</label>
                    <div className="flex border-2 border-gray-100 rounded-2xl overflow-hidden focus-within:border-sky-400 transition-colors bg-gray-50">
                      <span className="px-4 py-3.5 text-gray-500 text-sm font-bold border-r-2 border-gray-100 bg-white flex items-center">+91</span>
                      <input
                        type="tel" maxLength={10} value={phone}
                        onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="9876543210"
                        className="flex-1 px-4 py-3.5 text-base font-semibold focus:outline-none bg-gray-50 text-gray-900 placeholder:text-gray-300 placeholder:font-normal"
                        autoFocus
                      />
                    </div>
                  </div>

                  <Button type="submit" fullWidth size="lg" loading={loading}>
                    <span className="flex items-center gap-2">Get OTP <ChevronRight size={18} /></span>
                  </Button>
                </form>

                <p className="text-center text-xs text-gray-400 mt-5">
                  By continuing you agree to our{' '}
                  <span className="text-sky-500 font-semibold">Terms of Service</span>
                </p>
              </>
            ) : (
              <>
                <button
                  onClick={() => { setStep('phone'); setDevOtp(undefined); setOtp(['','','','','','']); }}
                  className="text-xs text-sky-500 font-bold mb-4 flex items-center gap-1"
                >
                  ← Change number
                </button>

                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck size={20} className="text-emerald-500" />
                  <h2 className="text-2xl font-extrabold text-gray-900">Verify OTP</h2>
                </div>
                <p className="text-gray-400 text-sm mb-5">
                  Sent to <span className="font-semibold text-gray-700">+91 {phone}</span>
                </p>

                {devOtp && (
                  <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 mb-5">
                    <Beaker size={14} className="text-amber-500 flex-shrink-0" />
                    <p className="text-xs text-amber-700 font-semibold">
                      Dev mode · Auto-filled OTP:{' '}
                      <span className="font-mono font-bold tracking-widest">{devOtp}</span>
                    </p>
                  </div>
                )}

                <div className="flex gap-2 justify-center mb-6">
                  {otp.map((d, i) => (
                    <input
                      key={i}
                      ref={el => { inputs.current[i] = el; }}
                      type="text" inputMode="numeric" maxLength={1} value={d}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleOtpKey(i, e)}
                      className={`w-12 h-14 text-center text-2xl font-extrabold border-2 rounded-2xl focus:outline-none transition-all ${
                        d ? 'border-sky-400 bg-sky-50 text-sky-700' : 'border-gray-200 bg-gray-50 text-gray-900'
                      } focus:border-sky-500`}
                    />
                  ))}
                </div>

                <Button fullWidth size="lg" loading={loading} onClick={verifyOtp}>
                  Verify & Login
                </Button>

                <div className="text-center mt-4">
                  {timer > 0 ? (
                    <p className="text-xs text-gray-400">Resend OTP in <span className="font-bold text-gray-600">{timer}s</span></p>
                  ) : (
                    <button
                      onClick={sendOtp as any}
                      className="text-xs text-sky-500 font-bold"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
