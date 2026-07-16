import { CheckCircle, Crown, Package as PackageIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useBookingStore } from '../../../features/bookingStore';
import Loader from '../../../components/common/Loader';
import type { Plan } from '../../../types';

const MOCK_PLANS: Plan[] = [
  { id: 1, name: 'One-Time Wash', type: 'one_time', price: 249, frequency: 'Per visit', includes_json: ['Exterior wash', 'Wipe-down', 'Glass wipe'] },
  { id: 2, name: 'Weekly Plan', type: 'weekly', price: 799, frequency: '4 washes/month', includes_json: ['4 exterior washes', 'Dashboard wipe', 'Free reschedule'] },
  { id: 3, name: 'Monthly Pro', type: 'monthly', price: 1499, frequency: 'Daily wash', popular: true, includes_json: ['Daily exterior wash', 'Interior vacuum 2x/week', 'Dashboard polish', 'Priority assignment'] },
];

export default function PackageStep() {
  const { form, updateForm, nextStep, prevStep } = useBookingStore();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => { setPlans(MOCK_PLANS); setLoading(false); }, 300);
  }, []);

  const handleSelect = (plan: Plan) => {
    updateForm({ planId: plan.id, totalAmount: plan.price });
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-luxuryGold/10 rounded-sm flex items-center justify-center">
          <PackageIcon size={20} className="text-luxuryGold" />
        </div>
        <h2 className="font-serif text-2xl text-white font-normal tracking-wide">Choose a Package</h2>
      </div>

      <div className="space-y-4">
        {plans.map((plan) => (
          <button
            key={plan.id}
            onClick={() => handleSelect(plan)}
            className={`group w-full text-left p-6 rounded-sm border-2 transition-all duration-300 hover:-translate-y-1 ${
              form.planId === plan.id 
                ? 'border-luxuryGold bg-luxuryGold/5 ring-2 ring-luxuryGold/30 shadow-lg shadow-luxuryGold/20' 
                : 'border-luxuryDark-border bg-luxuryDark-input hover:border-luxuryGold/50 hover:shadow-xl hover:shadow-black/20'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`font-serif text-xl font-normal tracking-wide transition-colors ${
                    form.planId === plan.id ? 'text-luxuryGold' : 'text-white group-hover:text-luxuryGold'
                  }`}>
                    {plan.name}
                  </span>
                  {plan.popular && (
                    <span className="bg-luxuryGold text-black text-[9px] font-bold px-3 py-1 rounded-sm inline-flex items-center gap-1 uppercase tracking-widest">
                      <Crown size={10} /> Popular
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mb-4 uppercase tracking-widest font-bold">{plan.frequency}</p>
                <ul className="space-y-2">
                  {plan.includes_json.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs text-gray-400 leading-relaxed">
                      <CheckCircle size={12} className="text-luxuryGold flex-shrink-0" /> 
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-right flex-shrink-0">
                <div className={`font-serif text-3xl font-medium mb-1 transition-colors ${
                  form.planId === plan.id ? 'text-luxuryGold' : 'text-white group-hover:text-luxuryGold'
                }`}>
                  ₹{plan.price}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">/{plan.type === 'one_time' ? 'wash' : 'month'}</div>
              </div>
            </div>
          </button>
        ))}
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
          disabled={!form.planId}
          className="flex-1 px-6 py-3 text-xs font-bold tracking-widest bg-luxuryGold hover:bg-luxuryGold-light text-black transition-all duration-300 uppercase rounded-sm disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-luxuryGold/10 hover:shadow-luxuryGold/20"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
