import { Car, MapPin, Calendar, Package, Sparkles, Crown } from 'lucide-react';
import { useBookingStore } from '../../features/bookingStore';

const PLAN_NAMES: Record<number, string> = { 1: 'One-Time Wash', 2: 'Weekly Plan', 3: 'Monthly Pro' };
const EXTRA_NAMES: Record<number, string> = {
  101: 'Interior Vacuum', 102: 'Dashboard Polish', 103: 'Tyre Dressing',
  104: 'Seat Sanitization', 105: 'Glass Cleaning (inside)',
};

export default function BookingSummary() {
  const { form } = useBookingStore();
  const hasAny = form.vehicleType || form.address || form.scheduledAt || form.planId;

  return (
    <div className="bg-luxuryDark-card border border-luxuryDark-border rounded-sm shadow-2xl shadow-black/30 p-6 lg:sticky lg:top-24 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[10px] font-bold text-luxuryGold uppercase tracking-[0.2em]">Booking Summary</h3>
        <Crown size={16} className="text-luxuryGold" />
      </div>

      {!hasAny ? (
        <div className="text-center py-12">
          <Sparkles size={32} className="text-gray-600 mx-auto mb-3 opacity-40" />
          <p className="text-sm text-gray-500 font-light tracking-wide">Your selections will appear here</p>
        </div>
      ) : (
        <div className="space-y-5">
          {form.vehicleType && (
            <div className="flex items-start gap-4 pb-4 border-b border-luxuryDark-border/60">
              <div className="w-10 h-10 bg-luxuryGold/10 rounded-sm flex items-center justify-center flex-shrink-0 border border-luxuryGold/20">
                <Car size={16} className="text-luxuryGold" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">Vehicle</p>
                <p className="text-sm font-medium text-white capitalize">{form.vehicleModel || form.vehicleType}</p>
                {form.plate && (
                  <p className="text-xs text-gray-400 font-mono tracking-widest mt-1">{form.plate}</p>
                )}
              </div>
            </div>
          )}
          {form.address && (
            <div className="flex items-start gap-4 pb-4 border-b border-luxuryDark-border/60">
              <div className="w-10 h-10 bg-luxuryGold/10 rounded-sm flex items-center justify-center flex-shrink-0 border border-luxuryGold/20">
                <MapPin size={16} className="text-luxuryGold" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">Location</p>
                <p className="text-sm font-medium text-white line-clamp-2 leading-relaxed">{form.address}</p>
                {form.pincode && (
                  <p className="text-xs text-gray-400 font-mono tracking-wider mt-1">PIN: {form.pincode}</p>
                )}
              </div>
            </div>
          )}
          {form.scheduledAt && (
            <div className="flex items-start gap-4 pb-4 border-b border-luxuryDark-border/60">
              <div className="w-10 h-10 bg-luxuryGold/10 rounded-sm flex items-center justify-center flex-shrink-0 border border-luxuryGold/20">
                <Calendar size={16} className="text-luxuryGold" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">Schedule</p>
                <p className="text-sm font-medium text-white">
                  {new Date(form.scheduledAt.replace('T', ' ')).toLocaleString('en-IN', { 
                    dateStyle: 'medium', 
                    timeStyle: 'short' 
                  })}
                </p>
              </div>
            </div>
          )}
          {form.planId && (
            <div className="flex items-start gap-4 pb-4 border-b border-luxuryDark-border/60">
              <div className="w-10 h-10 bg-luxuryGold/10 rounded-sm flex items-center justify-center flex-shrink-0 border border-luxuryGold/20">
                <Package size={16} className="text-luxuryGold" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">Plan</p>
                <p className="text-sm font-medium text-white">{PLAN_NAMES[form.planId] ?? `Plan #${form.planId}`}</p>
              </div>
            </div>
          )}
          {form.extras.length > 0 && (
            <div className="flex items-start gap-4 pb-4 border-b border-luxuryDark-border/60">
              <div className="w-10 h-10 bg-luxuryGold/10 rounded-sm flex items-center justify-center flex-shrink-0 border border-luxuryGold/20">
                <Sparkles size={16} className="text-luxuryGold" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">Add-ons ({form.extras.length})</p>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {form.extras.map(id => EXTRA_NAMES[id] ?? id).join(' • ')}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {form.totalAmount > 0 && (
        <div className="mt-6 pt-6 border-t-2 border-luxuryGold/30 flex items-center justify-between bg-luxuryGold/5 -mx-6 -mb-6 px-6 py-5 rounded-b-sm">
          <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Total</span>
          <div className="text-right">
            <span className="font-serif text-3xl font-medium text-luxuryGold">₹{form.totalAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>
      )}
    </div>
  );
}
