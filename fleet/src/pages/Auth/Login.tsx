import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Truck } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone'|'otp'>('phone');
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    if (phone.length !== 10) { toast.error('Enter 10-digit phone'); return; }
    setLoading(true);
    try {
      await api.post('/auth/send-otp', { phone });
      setStep('otp'); toast.success('OTP sent');
    } catch { toast.error('Failed to send OTP'); }
    finally { setLoading(false); }
  };

  const verify = async () => {
    if (otp.length !== 6) { toast.error('Enter 6-digit OTP'); return; }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/verify-otp', { phone, otp });
      if (data.data.user.role !== 'fleet_manager') {
        toast.error('Not a fleet manager account'); return;
      }
      login(
        { id: data.data.user.id, name: data.data.user.name, phone: data.data.user.phone, fleetId: 1, fleetName: 'My Fleet' },
        data.data.access_token
      );
      navigate('/');
    } catch { toast.error('Invalid OTP'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
            <Truck size={20} className="text-white"/>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">SparkWash Fleet</h1>
            <p className="text-xs text-gray-400">B2B Fleet Management Portal</p>
          </div>
        </div>

        {step === 'phone' ? (
          <>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Sign In</h2>
            <p className="text-sm text-gray-400 mb-6">Enter your registered fleet manager phone number</p>
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden mb-4 focus-within:ring-2 focus-within:ring-indigo-400">
              <span className="px-3 py-3 text-sm text-gray-500 bg-gray-50 border-r border-gray-200">+91</span>
              <input
                type="tel" inputMode="numeric" maxLength={10}
                value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g,''))}
                placeholder="9876543210" autoFocus
                className="flex-1 px-3 py-3 text-sm outline-none"
                onKeyDown={e => e.key === 'Enter' && sendOtp()}
              />
            </div>
            <button
              onClick={sendOtp} disabled={loading || phone.length !== 10}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold text-sm disabled:opacity-50 hover:bg-indigo-700 transition-colors"
            >
              {loading ? 'Sending…' : 'Get OTP'}
            </button>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Enter OTP</h2>
            <p className="text-sm text-gray-400 mb-6">Sent to +91 {phone}</p>
            <input
              type="tel" inputMode="numeric" maxLength={6}
              value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g,''))}
              placeholder="6-digit OTP" autoFocus
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-400 mb-4 text-center tracking-widest text-lg font-semibold"
              onKeyDown={e => e.key === 'Enter' && verify()}
            />
            <button
              onClick={verify} disabled={loading || otp.length !== 6}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold text-sm disabled:opacity-50 hover:bg-indigo-700 transition-colors"
            >
              {loading ? 'Verifying…' : 'Sign In'}
            </button>
            <button onClick={() => { setStep('phone'); setOtp(''); }} className="w-full mt-3 text-sm text-gray-400 hover:text-gray-600">
              ← Change number
            </button>
          </>
        )}

        <div className="mt-8 flex items-center gap-2 bg-slate-50 rounded-xl p-3 border border-slate-100">
          <Car size={14} className="text-slate-400"/>
          <p className="text-xs text-slate-500">Manage your company fleet, track bookings, and generate invoices in one place.</p>
        </div>
      </div>
    </div>
  );
}
