import { useState, useEffect } from 'react';
import { Calendar, Zap, Clock } from 'lucide-react';
import { useBookingStore } from '../../../features/bookingStore';
import api from '../../../services/api';

const TIME_SLOTS = [
  { label: '07:00 AM', value: '07:00' },
  { label: '08:00 AM', value: '08:00' },
  { label: '09:00 AM', value: '09:00' },
  { label: '10:00 AM', value: '10:00' },
  { label: '11:00 AM', value: '11:00' },
  { label: '12:00 PM', value: '12:00' },
  { label: '02:00 PM', value: '14:00' },
  { label: '03:00 PM', value: '15:00' },
  { label: '04:00 PM', value: '16:00' },
  { label: '05:00 PM', value: '17:00' },
  { label: '06:00 PM', value: '18:00' },
  { label: '07:00 PM', value: '19:00' },
];

const PEAK_HOURS = new Set([7, 8, 9, 17, 18, 19]);

function getTodayMin() {
  const d = new Date(); d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

interface SurgeInfo { is_surge: boolean; surge_multiplier: number; surge_reasons: string[]; final_price: number; base_price: number; }

export default function DateTimeStep() {
  const { form, updateForm, nextStep, prevStep } = useBookingStore();
  const [date, setDate] = useState(form.scheduledAt?.split('T')[0] ?? '');
  const [time, setTime] = useState(form.scheduledAt?.split('T')[1]?.slice(0, 5) ?? '');
  const [surge, setSurge] = useState<SurgeInfo | null>(null);
  const [loadingSurge, setLoadingSurge] = useState(false);

  // Fetch pricing whenever date + time + plan change
  useEffect(() => {
    if (!date || !time || !form.planId || !form.pincode) return;
    const iso = `${date}T${time}:00.000Z`;
    setLoadingSurge(true);
    api.post('/pricing/calculate', { plan_id: form.planId, scheduled_at: iso, pincode: form.pincode })
      .then(({ data }) => { setSurge(data.data); })
      .catch(() => setSurge(null))
      .finally(() => setLoadingSurge(false));
  }, [date, time, form.planId, form.pincode]);

  const selectTime = (t: string) => {
    setTime(t);
    updateForm({ scheduledAt: `${date}T${t}:00.000Z` });
  };
  const selectDate = (d: string) => {
    setDate(d);
    if (time) updateForm({ scheduledAt: `${d}T${time}:00.000Z` });
  };

  const hourNum = time ? parseInt(time.split(':')[0]) : -1;

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-luxuryGold/10 rounded-sm flex items-center justify-center">
          <Calendar size={20} className="text-luxuryGold" />
        </div>
        <h2 className="font-serif text-2xl text-white font-normal tracking-wide">Pick Date & Time</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wider">
            Select Date <span className="text-luxuryGold">*</span>
          </label>
          <input
            type="date" min={getTodayMin()} value={date}
            onChange={e => selectDate(e.target.value)}
            className="w-full px-4 py-3 bg-luxuryDark-input border border-luxuryDark-border text-white text-sm rounded-sm focus:outline-none focus:ring-2 focus:ring-luxuryGold focus:border-luxuryGold transition-all"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-500 mb-3 uppercase tracking-wider">
            Select Time Slot <span className="text-luxuryGold">*</span>
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {TIME_SLOTS.map(slot => {
              const h = parseInt(slot.value.split(':')[0]);
              const isPeak = PEAK_HOURS.has(h);
              return (
                <button
                  key={slot.value}
                  onClick={() => selectTime(slot.value)}
                  className={`group py-3 px-2 text-xs rounded-sm border-2 font-bold transition-all duration-300 relative hover:-translate-y-0.5 ${
                    time === slot.value
                      ? 'bg-luxuryGold border-luxuryGold text-black shadow-lg shadow-luxuryGold/30'
                      : 'border-luxuryDark-border text-gray-400 hover:border-luxuryGold/50 hover:text-luxuryGold bg-luxuryDark-input'
                  }`}
                >
                  <Clock size={12} className="inline mr-1 mb-0.5" />
                  {slot.label}
                  {isPeak && (
                    <span className={`absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center ${time === slot.value ? 'bg-black' : 'bg-amber-500'}`}>
                      <Zap size={8} className={time === slot.value ? 'text-luxuryGold' : 'text-black'} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
            <Zap size={12} className="text-amber-400" />
            <span className="font-light">Peak hours (7–9 AM, 5–7 PM) may have surge pricing</span>
          </div>
        </div>

        {/* Surge pricing notice */}
        {(surge || loadingSurge) && (
          <div className={`rounded-sm p-4 border-2 text-sm transition-all duration-300 ${
            loadingSurge 
              ? 'bg-luxuryDark-input border-luxuryDark-border' 
              : surge?.is_surge 
                ? 'bg-amber-500/10 border-amber-500/30' 
                : 'bg-green-500/10 border-green-500/30'
          }`}>
            {loadingSurge ? (
              <div className="flex items-center gap-2 text-gray-400">
                <Clock size={14} className="animate-spin" />
                <span className="text-xs font-medium">Checking price availability…</span>
              </div>
            ) : surge?.is_surge ? (
              <>
                <div className="flex items-center gap-2 text-amber-400 font-bold mb-2">
                  <Zap size={16} className="animate-pulse" /> 
                  Surge Pricing Active (+{Math.round((surge.surge_multiplier - 1) * 100)}%)
                </div>
                <p className="text-amber-300/90 text-xs mb-3 leading-relaxed">
                  {(surge.surge_reasons ?? []).join(' · ')}
                </p>
                <div className="flex items-baseline gap-3 pt-3 border-t border-amber-500/20">
                  <span className="text-xs text-gray-500 line-through">₹{surge.base_price}</span>
                  <span className="font-serif text-2xl font-medium text-amber-400">₹{surge.final_price}</span>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between text-green-400">
                <div className="flex items-center gap-2">
                  <Calendar size={14} /> 
                  <span className="font-semibold text-sm">Standard Pricing</span>
                </div>
                <span className="font-serif text-xl font-medium">₹{surge?.final_price}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-4 mt-8">
        <button
          onClick={prevStep}
          className="px-6 py-3 text-xs font-bold tracking-widest border-2 border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300 transition-all duration-300 uppercase rounded-sm"
        >
          Back
        </button>
        <button
          onClick={() => {
            if (surge) updateForm({ totalAmount: surge.final_price });
            nextStep();
          }}
          disabled={!date || !time}
          className="flex-1 px-6 py-3 text-xs font-bold tracking-widest bg-luxuryGold hover:bg-luxuryGold-light text-black transition-all duration-300 uppercase rounded-sm disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-luxuryGold/10 hover:shadow-luxuryGold/20"
        >
          {PEAK_HOURS.has(hourNum) && surge ? `Continue · ₹${surge.final_price}` : 'Continue'}
        </button>
      </div>
    </div>
  );
}
