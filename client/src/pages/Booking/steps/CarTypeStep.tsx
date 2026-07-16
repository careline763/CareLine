import { Car } from 'lucide-react';
import { useBookingStore } from '../../../features/bookingStore';
import type { Vehicle } from '../../../types';

const carTypes: { type: Vehicle['type']; label: string; emoji: string; desc: string }[] = [
  { type: 'hatchback', label: 'Hatchback', emoji: '🚗', desc: 'Swift, Alto, i20, Polo' },
  { type: 'sedan', label: 'Sedan', emoji: '🚙', desc: 'City, Verna, Ciaz, Dzire' },
  { type: 'suv', label: 'SUV', emoji: '🛻', desc: 'Creta, Seltos, Brezza, XUV300' },
  { type: 'muv', label: 'MUV / MPV', emoji: '🚐', desc: 'Innova, Ertiga, Marazzo' },
  { type: 'luxury', label: 'Luxury', emoji: '🏎️', desc: 'BMW, Mercedes, Audi, etc.' },
];

export default function CarTypeStep() {
  const { form, updateForm, nextStep } = useBookingStore();

  const handleSelect = (type: Vehicle['type']) => {
    updateForm({ vehicleType: type });
    setTimeout(() => nextStep(), 150);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-luxuryGold/10 rounded-sm flex items-center justify-center">
          <Car size={20} className="text-luxuryGold" />
        </div>
        <h2 className="font-serif text-2xl text-white font-normal tracking-wide">Select Your Car Type</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {carTypes.map(({ type, label, emoji, desc }) => (
          <button
            key={type}
            onClick={() => handleSelect(type)}
            className={`group flex items-center gap-4 p-5 rounded-sm border-2 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-luxuryGold/10 ${
              form.vehicleType === type 
                ? 'border-luxuryGold bg-luxuryGold/5 ring-2 ring-luxuryGold/30 shadow-lg shadow-luxuryGold/20' 
                : 'border-luxuryDark-border bg-luxuryDark-input hover:border-luxuryGold/50'
            }`}
          >
            <span className="text-4xl transform group-hover:scale-110 transition-transform duration-300">{emoji}</span>
            <div className="flex-1">
              <div className={`font-serif text-lg font-normal tracking-wide mb-1 transition-colors ${
                form.vehicleType === type ? 'text-luxuryGold' : 'text-white group-hover:text-luxuryGold'
              }`}>
                {label}
              </div>
              <div className="text-xs text-gray-400 tracking-wide font-light">{desc}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="space-y-4 mt-8 pt-6 border-t border-luxuryDark-border/60">
        <div>
          <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wider">
            Car Model <span className="text-gray-600">(Optional)</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Hyundai Creta"
            value={form.vehicleModel || ''}
            onChange={(e) => updateForm({ vehicleModel: e.target.value })}
            className="w-full px-4 py-3 bg-luxuryDark-input border border-luxuryDark-border text-white text-sm rounded-sm focus:outline-none focus:ring-2 focus:ring-luxuryGold focus:border-luxuryGold transition-all placeholder:text-gray-600"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wider">
            Number Plate <span className="text-gray-600">(Optional)</span>
          </label>
          <input
            type="text"
            placeholder="e.g. MH02AB1234"
            value={form.plate || ''}
            onChange={(e) => updateForm({ plate: e.target.value.toUpperCase() })}
            className="w-full px-4 py-3 bg-luxuryDark-input border border-luxuryDark-border text-white text-sm rounded-sm focus:outline-none focus:ring-2 focus:ring-luxuryGold focus:border-luxuryGold transition-all placeholder:text-gray-600 uppercase tracking-widest font-mono"
          />
        </div>
      </div>
    </div>
  );
}
