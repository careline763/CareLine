import { Plus, Minus, Sparkles } from 'lucide-react';
import { useBookingStore } from '../../../features/bookingStore';

const EXTRAS = [
  { id: 101, name: 'Interior Vacuum', price: 199 },
  { id: 102, name: 'Dashboard Polish', price: 99 },
  { id: 103, name: 'Tyre Dressing', price: 79 },
  { id: 104, name: 'Seat Sanitization', price: 149 },
  { id: 105, name: 'Glass Cleaning (inside)', price: 99 },
];

export default function ExtrasStep() {
  const { form, updateForm, nextStep, prevStep } = useBookingStore();
  const extras = form.extras || [];

  const toggle = (id: number) => {
    const isSelected = extras.includes(id);
    const newExtras = isSelected ? extras.filter((e) => e !== id) : [...extras, id];
    const extraTotal = newExtras.reduce((sum, eid) => {
      const ex = EXTRAS.find((e) => e.id === eid);
      return sum + (ex?.price || 0);
    }, 0);
    const basePlan = MOCK_BASE_PLAN_PRICE[form.planId || 1] || 249;
    updateForm({ extras: newExtras, totalAmount: basePlan + extraTotal });
  };

  const basePlan = MOCK_BASE_PLAN_PRICE[form.planId || 1] || 249;
  const extrasTotal = extras.reduce((sum, id) => sum + (EXTRAS.find((e) => e.id === id)?.price || 0), 0);

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-luxuryGold/10 rounded-sm flex items-center justify-center">
          <Sparkles size={20} className="text-luxuryGold" />
        </div>
        <div>
          <h2 className="font-serif text-2xl text-white font-normal tracking-wide">Add-On Services</h2>
          <p className="text-xs text-gray-500 mt-1 font-light">Optional extras to enhance your wash</p>
        </div>
      </div>

      <div className="space-y-3 mb-8">
        {EXTRAS.map((extra) => {
          const selected = extras.includes(extra.id);
          return (
            <div 
              key={extra.id} 
              className={`flex items-center justify-between p-5 rounded-sm border-2 transition-all duration-300 group ${
                selected 
                  ? 'border-luxuryGold bg-luxuryGold/5 shadow-lg shadow-luxuryGold/10' 
                  : 'border-luxuryDark-border bg-luxuryDark-input hover:border-luxuryGold/50'
              }`}
            >
              <div className="flex-1">
                <span className={`font-medium text-sm transition-colors ${
                  selected ? 'text-luxuryGold' : 'text-white group-hover:text-luxuryGold'
                }`}>
                  {extra.name}
                </span>
                <span className="text-xs text-gray-500 ml-3 font-mono">+₹{extra.price}</span>
              </div>
              <button
                onClick={() => toggle(extra.id)}
                className={`w-10 h-10 rounded-sm flex items-center justify-center transition-all duration-300 border-2 ${
                  selected 
                    ? 'bg-luxuryGold border-luxuryGold text-black shadow-lg shadow-luxuryGold/20' 
                    : 'bg-luxuryDark-card border-luxuryDark-border text-gray-500 hover:border-luxuryGold hover:text-luxuryGold'
                }`}
              >
                {selected ? <Minus size={16} className="font-bold" /> : <Plus size={16} />}
              </button>
            </div>
          );
        })}
      </div>

      {/* Pricing Summary */}
      <div className="bg-luxuryDark-input border-2 border-luxuryDark-border rounded-sm p-6 mb-8">
        <div className="flex justify-between text-sm text-gray-400 mb-3">
          <span>Base Plan</span>
          <span className="font-mono">₹{basePlan}</span>
        </div>
        {extras.length > 0 && (
          <div className="flex justify-between text-sm text-gray-400 mb-3">
            <span>Add-ons ({extras.length})</span>
            <span className="font-mono text-luxuryGold">+₹{extrasTotal}</span>
          </div>
        )}
        <div className="border-t-2 border-luxuryGold/30 pt-4 mt-4 flex justify-between items-baseline">
          <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Total Amount</span>
          <span className="font-serif text-3xl font-medium text-luxuryGold">₹{form.totalAmount}</span>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={prevStep}
          className="px-6 py-3 text-xs font-bold tracking-widest border-2 border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300 transition-all duration-300 uppercase rounded-sm"
        >
          Back
        </button>
        <button
          onClick={nextStep}
          className="flex-1 px-6 py-3 text-xs font-bold tracking-widest bg-luxuryGold hover:bg-luxuryGold-light text-black transition-all duration-300 uppercase rounded-sm shadow-lg shadow-luxuryGold/10 hover:shadow-luxuryGold/20"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
}

const MOCK_BASE_PLAN_PRICE: Record<number, number> = { 1: 249, 2: 799, 3: 1499 };
