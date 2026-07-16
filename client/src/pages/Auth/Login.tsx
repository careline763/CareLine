import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Phone, Beaker } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';
import { sendOTP } from '../../services/auth.service';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  // devMode becomes true after the first Send OTP response confirms bypass is active.
  const [devMode, setDevMode] = useState(false);
  const navigate = useNavigate();

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) return toast.error('Enter a valid 10-digit phone number');
    setLoading(true);
    try {
      const res = await sendOTP(phone);
      // dev_otp is only present in the response when the server has OTP_BYPASS=true
      // and NODE_ENV !== 'production'. It is never returned in production.
      const devOtp = (res.data as any)?.data?.dev_otp as string | undefined;
      if (devOtp) {
        setDevMode(true);
        toast.success(`[DEV] OTP: ${devOtp}`, { duration: 20000 });
      } else {
        toast.success('OTP sent!');
      }
      navigate('/verify-otp', { state: { phone, devOtp } });
    } catch {
      toast.error('Failed to send OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
      <div className="w-full max-w-sm">
        {/* DEV-ONLY banner — visible only when OTP_BYPASS is active on the server */}
        {devMode && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 mb-4">
            <Beaker size={15} className="text-amber-500 shrink-0" />
            <p className="text-xs text-amber-700 font-medium">
              Dev testing mode — use OTP <span className="font-mono font-bold">123456</span>
            </p>
          </div>
        )}

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <Car size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome to CareLine</h1>
          <p className="text-gray-500 text-sm mt-1">Enter your phone number to continue</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="9876543210"
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
              </div>
            </div>
            <Button type="submit" fullWidth size="lg" loading={loading}>
              <Phone size={16} />
              Send OTP
            </Button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-4">
            By continuing, you agree to our Terms & Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
