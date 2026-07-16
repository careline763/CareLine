import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, ShieldCheck, Beaker } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import type { User } from '../../types';

type Step = 'phone' | 'otp';

export default function Login() {
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  // devOtp is set when the server returns dev_otp (OTP_BYPASS=true, non-production).
  const [devOtp, setDevOtp] = useState<string | undefined>(undefined);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) return toast.error('Enter a valid 10-digit phone number');
    setLoading(true);
    try {
      const res = await api.post('/auth/otp/send', { phone });
      // dev_otp present only when server OTP_BYPASS=true and NODE_ENV !== 'production'
      const bypass = (res.data as any)?.data?.dev_otp as string | undefined;
      if (bypass) {
        setDevOtp(bypass);
        setOtp(bypass);
        toast.success(`[DEV] OTP: ${bypass}`, { duration: 20000 });
      } else {
        toast.success('OTP sent!');
      }
      setStep('otp');
    } catch { toast.error('Failed to send OTP'); }
    finally { setLoading(false); }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return toast.error('Enter 6-digit OTP');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/otp/verify', { phone, otp });
      let u = data.data.user as User;
      if (u.role !== 'admin') {
        if (devOtp) {
          // Dev mode: auto-promote to admin for testing
          await api.post('/dev/set-role', { phone, role: 'admin' });
          u = { ...u, role: 'admin' };
          toast.success('[DEV] Promoted to admin for testing');
        } else {
          toast.error('Access denied. Admin only.');
          return;
        }
      }
      setAuth(u, data.data.access_token);
      toast.success('Welcome back!');
      navigate('/');
    } catch { toast.error('Invalid OTP'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-600 rounded-2xl mb-4">
            <Car size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">SparkWash Admin</h1>
          <p className="text-gray-400 text-sm mt-1">Sign in to your admin account</p>
        </div>

        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
          {step === 'phone' ? (
            <form onSubmit={sendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Phone Number</label>
                <div className="flex">
                  <span className="flex items-center px-3 bg-gray-700 border border-r-0 border-gray-600 rounded-l-lg text-gray-400 text-sm">+91</span>
                  <input type="tel" maxLength={10} value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g,''))}
                    className="flex-1 px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-r-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="9876543210" />
                </div>
              </div>
              <Button fullWidth loading={loading} type="submit" size="lg">Send OTP</Button>
            </form>
          ) : (
            <form onSubmit={verifyOtp} className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 text-sm mb-2">
                <ShieldCheck size={15}/> OTP sent to +91 {phone}
              </div>

              {/* DEV-ONLY banner — shown only when server bypass is active */}
              {devOtp && (
                <div className="flex items-center gap-2 bg-amber-900/40 border border-amber-600/50 rounded-lg px-3 py-2">
                  <Beaker size={13} className="text-amber-400 shrink-0" />
                  <p className="text-xs text-amber-300 font-medium">
                    Dev mode — OTP auto-filled: <span className="font-mono font-bold">{devOtp}</span>
                  </p>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">6-digit OTP</label>
                <input type="text" maxLength={6} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g,''))}
                  className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm tracking-widest text-center text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="000000" />
              </div>
              <Button fullWidth loading={loading} type="submit" size="lg">Verify & Login</Button>
              <button type="button" onClick={() => { setStep('phone'); setDevOtp(undefined); setOtp(''); }}
                className="w-full text-xs text-gray-500 hover:text-gray-300">← Change number</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
