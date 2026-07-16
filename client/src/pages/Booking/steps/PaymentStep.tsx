import { CreditCard, ShieldCheck, Tag, CheckCircle, Wallet, X, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useBookingStore } from '../../../features/bookingStore';
import api from '../../../services/api';

export default function PaymentStep() {
  const { form, prevStep, resetBooking, updateForm } = useBookingStore();
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplying, setCouponApplying] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [appliedCode, setAppliedCode] = useState('');
  const navigate = useNavigate();

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponApplying(true);
    try {
      const { data } = await api.post('/coupons/apply', {
        code: couponCode.toUpperCase(),
        order_amount: form.totalAmount,
      });
      setAppliedDiscount(data.data?.discount ?? 0);
      setAppliedCode(couponCode.toUpperCase());
      updateForm({ couponCode: couponCode.toUpperCase() });
      toast.success(data.message);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Invalid coupon';
      toast.error(msg);
    } finally {
      setCouponApplying(false);
    }
  };

  const removeCoupon = () => {
    setAppliedDiscount(0);
    setAppliedCode('');
    setCouponCode('');
    updateForm({ couponCode: undefined });
  };

  const finalAmount = Math.max(form.totalAmount - appliedDiscount, 0);

  const handlePay = async () => {
    setLoading(true);
    try {
      // POST /bookings → get razorpay_order_id
      // Open Razorpay checkout → on success confirm
      await new Promise((r) => setTimeout(r, 1500));
      toast.success('Booking confirmed!');
      resetBooking();
      navigate('/bookings');
    } catch {
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-luxuryGold/10 rounded-sm flex items-center justify-center">
          <CreditCard size={20} className="text-luxuryGold" />
        </div>
        <h2 className="font-serif text-2xl text-white font-normal tracking-wide">Payment Summary</h2>
      </div>

      {/* Order Summary Card */}
      <div className="bg-luxuryDark-input border-2 border-luxuryDark-border rounded-sm p-6 space-y-4 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 uppercase tracking-wider text-xs font-bold">Vehicle Type</span>
          <span className="font-medium text-white capitalize">{form.vehicleType || '—'}</span>
        </div>
        {form.vehicleModel && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 uppercase tracking-wider text-xs font-bold">Model</span>
            <span className="font-medium text-white">{form.vehicleModel}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 uppercase tracking-wider text-xs font-bold">Location</span>
          <span className="font-medium text-white text-right max-w-[60%] line-clamp-2 leading-relaxed">{form.address || '—'}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 uppercase tracking-wider text-xs font-bold">Schedule</span>
          <span className="font-medium text-white">
            {form.scheduledAt ? new Date(form.scheduledAt.replace('T', ' ')).toLocaleString('en-IN', {
              dateStyle: 'medium',
              timeStyle: 'short'
            }) : '—'}
          </span>
        </div>
        {form.extras.length > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 uppercase tracking-wider text-xs font-bold">Add-ons</span>
            <span className="font-medium text-luxuryGold">{form.extras.length} selected</span>
          </div>
        )}
        
        <div className="border-t-2 border-luxuryDark-border pt-4 space-y-2">
          <div className="flex justify-between text-sm text-gray-400">
            <span>Subtotal</span>
            <span className="font-mono">₹{form.totalAmount}</span>
          </div>
          {appliedDiscount > 0 && (
            <div className="flex justify-between text-sm text-green-400 font-medium">
              <span className="flex items-center gap-1">
                <Tag size={12} /> Coupon ({appliedCode})
              </span>
              <span className="font-mono">−₹{appliedDiscount}</span>
            </div>
          )}
          <div className="border-t-2 border-luxuryGold/30 pt-3 flex justify-between items-baseline">
            <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Total Amount</span>
            <span className="font-serif text-3xl font-medium text-luxuryGold">₹{finalAmount}</span>
          </div>
        </div>
      </div>

      {/* Coupon Section */}
      {!appliedCode ? (
        <div className="mb-6">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">Have a coupon code?</p>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Tag size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                value={couponCode}
                onChange={e => setCouponCode(e.target.value.toUpperCase())}
                placeholder="e.g. FIRST50"
                className="w-full pl-11 pr-4 py-3 bg-luxuryDark-input border border-luxuryDark-border text-white text-sm font-mono uppercase rounded-sm focus:outline-none focus:ring-2 focus:ring-luxuryGold focus:border-luxuryGold transition-all placeholder:text-gray-600"
                onKeyDown={e => e.key === 'Enter' && applyCoupon()}
              />
            </div>
            <button 
              onClick={applyCoupon} 
              disabled={couponApplying}
              className="px-6 py-3 text-xs font-bold tracking-widest border-2 border-luxuryGold text-luxuryGold hover:bg-luxuryGold hover:text-black transition-all duration-300 uppercase rounded-sm disabled:opacity-50 flex items-center gap-2"
            >
              {couponApplying && <Loader2 size={14} className="animate-spin" />}
              Apply
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-6 bg-green-500/10 border-2 border-green-500/30 rounded-sm px-5 py-4 flex items-center justify-between animate-[fadeIn_0.3s_ease]">
          <div className="flex items-center gap-3 text-green-400">
            <CheckCircle size={18} />
            <span className="text-sm font-bold tracking-wide">{appliedCode} — ₹{appliedDiscount} off applied</span>
          </div>
          <button 
            onClick={removeCoupon} 
            className="text-red-400 hover:text-red-300 transition-colors p-1"
            title="Remove coupon"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Info Messages */}
      <div className="space-y-3 mb-8">
        <div className="flex items-center gap-2 text-xs text-gray-500 bg-luxuryDark-input border border-luxuryDark-border rounded-sm p-3">
          <Wallet size={14} className="text-luxuryGold flex-shrink-0" />
          <span className="font-light leading-relaxed">Wallet balance will be automatically applied at checkout</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 bg-luxuryDark-input border border-luxuryDark-border rounded-sm p-3">
          <ShieldCheck size={14} className="text-green-500 flex-shrink-0" />
          <span className="font-light leading-relaxed">100% secure payment via Razorpay. UPI, Cards, Wallets accepted</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={prevStep}
          className="px-6 py-3 text-xs font-bold tracking-widest border-2 border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300 transition-all duration-300 uppercase rounded-sm"
        >
          Back
        </button>
        <button
          onClick={handlePay}
          disabled={loading}
          className="flex-1 px-6 py-4 text-sm font-bold tracking-widest bg-luxuryGold hover:bg-luxuryGold-light text-black transition-all duration-300 uppercase rounded-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-luxuryGold/20 hover:shadow-luxuryGold/30 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Processing...
            </>
          ) : (
            <>Pay ₹{finalAmount}</>
          )}
        </button>
      </div>
    </div>
  );
}
