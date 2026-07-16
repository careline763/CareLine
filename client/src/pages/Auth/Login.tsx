import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Phone, Sparkles, Shield, Clock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { sendOTP } from '../../services/auth.service';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [devMode, setDevMode] = useState(false);
  const navigate = useNavigate();

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) return toast.error('Enter a valid 10-digit phone number');
    setLoading(true);
    try {
      const res = await sendOTP(phone);
      const devOtp = (res.data as any)?.data?.dev_otp as string | undefined;
      if (devOtp) {
        setDevMode(true);
        toast.success(`[DEV] OTP: ${devOtp}`, { duration: 20000 });
      } else {
        toast.success('OTP sent to your phone!');
      }
      navigate('/verify-otp', { state: { phone, devOtp } });
    } catch {
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-luxuryDark-base relative overflow-hidden flex items-center justify-center">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-luxuryGold/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-luxuryGold/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-luxuryGold/3 rounded-full blur-3xl"></div>
      </div>

      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(197,168,128,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(197,168,128,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Branding & Features */}
          <div className="hidden lg:block space-y-8">
            {/* Logo & Tagline */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-16 h-16 bg-luxuryGold/10 rounded-sm flex items-center justify-center border border-luxuryGold/30 backdrop-blur-sm">
                  <Car size={32} className="text-luxuryGold" />
                </div>
                <div>
                  <h1 className="font-serif text-4xl text-luxuryGold font-semibold tracking-wide">CareLine</h1>
                  <p className="text-[10px] tracking-[0.3em] text-gray-500 uppercase font-bold">Premium Car Care</p>
                </div>
              </div>
              
              <h2 className="font-serif text-4xl text-white leading-tight font-normal">
                Your Car Deserves<br />
                <span className="text-luxuryGold italic">Excellence</span>
              </h2>
              
              <p className="text-gray-400 text-sm leading-relaxed max-w-md">
                Experience premium doorstep car care with verified professionals. Book instantly, track in real-time, and enjoy spotless results every time.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-4">
              {[
                { icon: Shield, text: 'Verified & Trained Professionals' },
                { icon: Clock, text: 'Doorstep Service at Your Convenience' },
                { icon: CheckCircle, text: 'Quality Guaranteed Every Time' },
              ].map(({ icon: Icon, text }, idx) => (
                <div 
                  key={text}
                  className="flex items-center gap-4 p-4 bg-luxuryDark-card/50 border border-luxuryDark-border/60 rounded-sm backdrop-blur-sm hover:border-luxuryGold/30 transition-all duration-300"
                  style={{
                    animation: `fadeInLeft 0.6s ease forwards ${idx * 0.1}s`,
                    opacity: 0
                  }}
                >
                  <div className="w-10 h-10 bg-luxuryGold/10 rounded-sm flex items-center justify-center flex-shrink-0">
                    <Icon size={20} className="text-luxuryGold" />
                  </div>
                  <span className="text-sm text-gray-300 font-medium">{text}</span>
                </div>
              ))}
            </div>

            {/* Trust Badge */}
            <div className="flex items-center gap-6 pt-6 border-t border-luxuryDark-border/60">
              <div className="text-center">
                <p className="font-serif text-2xl text-luxuryGold font-medium">10K+</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Happy Customers</p>
              </div>
              <div className="text-center">
                <p className="font-serif text-2xl text-luxuryGold font-medium">500+</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Verified Partners</p>
              </div>
              <div className="text-center">
                <p className="font-serif text-2xl text-luxuryGold font-medium">4.8★</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Average Rating</p>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md">
              
              {/* Mobile Logo (visible only on mobile) */}
              <div className="lg:hidden text-center mb-8">
                <div className="inline-flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 bg-luxuryGold/10 rounded-sm flex items-center justify-center border border-luxuryGold/30">
                    <Car size={28} className="text-luxuryGold" />
                  </div>
                  <div>
                    <h1 className="font-serif text-3xl text-luxuryGold font-semibold tracking-wide">CareLine</h1>
                    <p className="text-[9px] tracking-[0.3em] text-gray-500 uppercase font-bold">Premium Car Care</p>
                  </div>
                </div>
              </div>

              {/* Login Card */}
              <div className="bg-luxuryDark-card border border-luxuryDark-border rounded-sm p-8 shadow-2xl shadow-black/40 backdrop-blur-sm">
                
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-luxuryGold/10 rounded-sm mb-4 border border-luxuryGold/20">
                    <Sparkles size={28} className="text-luxuryGold animate-pulse" />
                  </div>
                  <h2 className="font-serif text-2xl text-white font-normal tracking-wide mb-2">Welcome Back</h2>
                  <p className="text-sm text-gray-400 font-light">Enter your phone number to continue</p>
                </div>

                {/* Dev Mode Banner */}
                {devMode && (
                  <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-sm px-4 py-3 mb-6">
                    <Shield size={16} className="text-amber-400 flex-shrink-0" />
                    <p className="text-xs text-amber-300 font-medium">
                      Development Mode: Use OTP <span className="font-mono font-bold">123456</span>
                    </p>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSend} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-3 uppercase tracking-wider">
                      Phone Number <span className="text-luxuryGold">*</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-luxuryDark-border pr-3">
                        <Phone size={16} className="text-gray-500" />
                        <span className="text-sm text-gray-400 font-medium">+91</span>
                      </div>
                      <input
                        type="tel"
                        maxLength={10}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="9876543210"
                        className="w-full pl-24 pr-4 py-4 bg-luxuryDark-input border-2 border-luxuryDark-border text-white text-sm rounded-sm focus:outline-none focus:border-luxuryGold transition-all placeholder:text-gray-600 font-mono tracking-wider"
                      />
                      <div className="absolute inset-0 rounded-sm opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none">
                        <div className="absolute inset-0 rounded-sm ring-2 ring-luxuryGold/20"></div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-2 font-light">We'll send you a verification code</p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || phone.length !== 10}
                    className="w-full py-4 bg-luxuryGold hover:bg-luxuryGold-light text-black text-sm font-bold tracking-widest uppercase rounded-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-luxuryGold/20 hover:shadow-luxuryGold/40 flex items-center justify-center gap-2 group"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                        <span>Sending OTP...</span>
                      </>
                    ) : (
                      <>
                        <Phone size={18} className="group-hover:rotate-12 transition-transform" />
                        <span>Send OTP</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Terms */}
                <p className="text-[11px] text-gray-600 text-center mt-6 leading-relaxed font-light">
                  By continuing, you agree to our{' '}
                  <a href="#" className="text-luxuryGold hover:text-luxuryGold-light underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-luxuryGold hover:text-luxuryGold-light underline">Privacy Policy</a>
                </p>

                {/* Divider */}
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-luxuryDark-border/60"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-luxuryDark-card px-6 text-gray-600 tracking-[0.3em] font-bold text-xs uppercase" style={{ 
                      backgroundImage: 'linear-gradient(transparent calc(50% - 0.5px), rgba(197, 168, 128, 0.4) calc(50% - 0.5px), rgba(197, 168, 128, 0.4) calc(50% + 0.5px), transparent calc(50% + 0.5px))'
                    }}>
                      Secure Login
                    </span>
                  </div>
                </div>

                {/* Security Badges */}
                <div className="flex items-center justify-center gap-6 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Shield size={14} className="text-green-500" />
                    <span className="text-[10px] uppercase tracking-wider">Encrypted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-luxuryGold" />
                    <span className="text-[10px] uppercase tracking-wider">Verified</span>
                  </div>
                </div>
              </div>

              {/* Help Text */}
              <p className="text-center text-xs text-gray-600 mt-6">
                Need help? Contact us at{' '}
                <a href="mailto:support@careline.in" className="text-luxuryGold hover:text-luxuryGold-light">support@careline.in</a>
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
