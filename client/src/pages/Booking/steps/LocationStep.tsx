import { useState } from 'react';
import { MapPin, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useBookingStore } from '../../../features/bookingStore';
import Button from '../../../components/common/Button';
import { checkPincode } from '../../../services/plans.service';
import type { ServiceArea } from '../../../types';
import toast from 'react-hot-toast';

export default function LocationStep() {
  const { form, updateForm, nextStep, prevStep } = useBookingStore();
  const [checking, setChecking] = useState(false);
  const [area, setArea] = useState<ServiceArea | null>(null);
  const [notAvailable, setNotAvailable] = useState(false);

  const handleCheck = async () => {
    if (form.pincode.length !== 6) return toast.error('Enter a valid 6-digit pincode');
    setChecking(true);
    setArea(null);
    setNotAvailable(false);
    try {
      const { data } = await checkPincode(form.pincode);
      const area = (data as any).data as ServiceArea;
      if (area?.is_active) {
        setArea(area);
      } else {
        setNotAvailable(true);
      }
    } catch {
      setNotAvailable(true);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-luxuryGold/10 rounded-sm flex items-center justify-center">
          <MapPin size={20} className="text-luxuryGold" />
        </div>
        <h2 className="font-serif text-2xl text-white font-normal tracking-wide">Service Location</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wider">
            Pincode <span className="text-luxuryGold">*</span>
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              maxLength={6}
              placeholder="e.g. 110001"
              value={form.pincode}
              onChange={(e) => {
                updateForm({ pincode: e.target.value.replace(/\D/g, '') });
                setArea(null);
                setNotAvailable(false);
              }}
              className="flex-1 px-4 py-3 bg-luxuryDark-input border border-luxuryDark-border text-white text-sm rounded-sm focus:outline-none focus:ring-2 focus:ring-luxuryGold focus:border-luxuryGold transition-all placeholder:text-gray-600 font-mono tracking-widest"
            />
            <button 
              onClick={handleCheck} 
              disabled={checking}
              className="px-6 py-3 text-xs font-bold tracking-widest border-2 border-luxuryGold text-luxuryGold hover:bg-luxuryGold hover:text-black transition-all duration-300 uppercase rounded-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {checking && <Loader2 size={14} className="animate-spin" />}
              Check
            </button>
          </div>
        </div>

        {area && (
          <div className="flex items-start gap-3 p-4 bg-green-500/10 border-2 border-green-500/30 rounded-sm animate-[fadeIn_0.3s_ease]">
            <CheckCircle size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-green-400 mb-1">Service Available in {area.city}!</p>
              {area.is_waterless_zone && (
                <p className="text-xs text-green-300/80 leading-relaxed">Waterless plans recommended for this area to conserve water.</p>
              )}
            </div>
          </div>
        )}

        {notAvailable && (
          <div className="flex items-start gap-3 p-4 bg-red-500/10 border-2 border-red-500/30 rounded-sm animate-[fadeIn_0.3s_ease]">
            <XCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-400 leading-relaxed">Service not available in this pincode yet. We're expanding rapidly across India!</p>
          </div>
        )}

        <div>
          <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wider">
            Full Address <span className="text-luxuryGold">*</span>
          </label>
          <textarea
            rows={4}
            placeholder="Flat/House No, Building Name, Street, Landmark, Area"
            value={form.address}
            onChange={(e) => updateForm({ address: e.target.value })}
            className="w-full px-4 py-3 bg-luxuryDark-input border border-luxuryDark-border text-white text-sm rounded-sm focus:outline-none focus:ring-2 focus:ring-luxuryGold focus:border-luxuryGold transition-all resize-none placeholder:text-gray-600 leading-relaxed"
          />
        </div>
      </div>

      <div className="flex gap-4 mt-8">
        <button
          onClick={prevStep}
          className="px-6 py-3 text-xs font-bold tracking-widest border-2 border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300 transition-all duration-300 uppercase rounded-sm"
        >
          Back
        </button>
        <button
          onClick={nextStep}
          disabled={!area || !form.address.trim()}
          className="flex-1 px-6 py-3 text-xs font-bold tracking-widest bg-luxuryGold hover:bg-luxuryGold-light text-black transition-all duration-300 uppercase rounded-sm disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-luxuryGold/10 hover:shadow-luxuryGold/20"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
