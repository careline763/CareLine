import { useEffect, useState } from 'react';
import { CheckCircle, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import type { Plan } from '../../types';
import { useBookingStore } from '../../features/bookingStore';

const MOCK_PLANS: Plan[] = [
  {
    id: 1, name: 'One-Time Wash', type: 'one_time', price: 249, frequency: 'Per visit',
    includes_json: ['Exterior wash', 'Wipe-down & dry', 'Tyre cleaning', 'Glass wipe'],
  },
  {
    id: 2, name: 'Weekly Plan', type: 'weekly', price: 799, frequency: '4 washes/month', popular: false,
    includes_json: ['4 exterior washes', 'Dashboard wipe', 'Tyre dressing', 'Glass cleaning', 'Free reschedule'],
  },
  {
    id: 3, name: 'Monthly Pro', type: 'monthly', price: 1499, frequency: 'Daily wash', popular: true,
    includes_json: ['Daily exterior wash', 'Interior vacuum (2x/week)', 'Dashboard polish', 'Seat sanitization (monthly)', 'Priority partner assignment', 'Before & after photos'],
  },
  {
    id: 4, name: 'Society Plan', type: 'society', price: 12999, frequency: 'Up to 20 cars',
    includes_json: ['Bulk pricing for RWAs', 'Dedicated partner team', 'Single billing point', 'Weekly reporting', 'Custom schedule'],
  },
];

const typeBadge: Record<Plan['type'], string> = {
  one_time: 'One-Time',
  weekly: 'Weekly',
  monthly: 'Monthly',
  society: 'Society',
};

export default function Plans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { updateForm } = useBookingStore();

  useEffect(() => {
    setTimeout(() => {
      setPlans(MOCK_PLANS);
      setLoading(false);
    }, 400);
  }, []);

  const handleSelect = (plan: Plan) => {
    updateForm({ planId: plan.id, totalAmount: plan.price });
    navigate('/book');
  };

  if (loading) return <Loader fullPage />;

  return (
    <div className="min-h-screen bg-luxuryDark-base">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-bold tracking-[0.3em] text-luxuryGold uppercase block mb-3">PRICING PLANS</span>
          <h1 className="font-serif text-4xl md:text-5xl text-white font-normal tracking-wide mb-4">
            Simple, Transparent Pricing
          </h1>
          <div className="h-0.5 w-16 bg-luxuryGold mx-auto mb-6"></div>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto font-light tracking-wide leading-relaxed">
            Pick a plan that suits your car and lifestyle. Cancel or pause anytime with no hidden fees.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-luxuryDark-card border-2 rounded-sm overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-luxuryGold/20 flex flex-col ${
                plan.popular 
                  ? 'border-luxuryGold shadow-lg shadow-luxuryGold/10' 
                  : 'border-luxuryDark-border hover:border-luxuryGold/50'
              }`}
            >
              {/* Most Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <span className="bg-luxuryGold text-black text-[10px] font-bold px-5 py-2 rounded-sm inline-flex items-center gap-1.5 uppercase tracking-widest shadow-lg whitespace-nowrap">
                    <Crown size={12} /> Most Popular
                  </span>
                </div>
              )}

              {/* Card Content - flex-grow to push button down */}
              <div className="p-6 flex-grow">
                {/* Type Badge */}
                <div className="mb-4 mt-2">
                  <span className="inline-block text-[10px] font-bold text-luxuryGold bg-luxuryDark-input border border-luxuryGold/20 px-3 py-1.5 rounded-sm uppercase tracking-widest">
                    {typeBadge[plan.type]}
                  </span>
                </div>

                {/* Plan Name */}
                <h3 className="font-serif text-2xl text-white font-normal mb-2 tracking-wide">{plan.name}</h3>
                
                {/* Frequency */}
                <p className="text-xs text-gray-500 mb-6 uppercase tracking-widest font-semibold">{plan.frequency}</p>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-4xl text-luxuryGold font-medium">₹{plan.price.toLocaleString('en-IN')}</span>
                    <span className="text-gray-500 text-xs">/{plan.type === 'one_time' ? 'wash' : 'mo'}</span>
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-3">
                  {plan.includes_json.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-gray-300 leading-relaxed">
                      <CheckCircle size={14} className="text-luxuryGold mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Button - At bottom with flex-shrink-0 */}
              <div className="px-6 pb-6 flex-shrink-0">
                <button
                  onClick={() => handleSelect(plan)}
                  className="w-full py-3.5 text-sm font-bold tracking-[0.2em] uppercase rounded-md transition-all duration-300 bg-transparent border-2 border-luxuryGold text-luxuryGold hover:bg-luxuryGold hover:text-black"
                >
                  {plan.type === 'society' ? 'CONTACT US' : 'GET STARTED'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-luxuryDark-card border border-luxuryDark-border rounded-sm p-8 text-center max-w-2xl mx-auto">
          <h3 className="font-serif text-2xl text-white font-normal mb-3 tracking-wide">Not sure which plan to pick?</h3>
          <p className="text-sm text-gray-400 mb-6 font-light tracking-wide leading-relaxed">
            Start with a one-time wash and upgrade anytime. Our team is happy to help you choose the perfect plan.
          </p>
          <Button variant="outline" onClick={() => navigate('/support')}>
            Talk to Support
          </Button>
        </div>
      </div>
    </div>
  );
}
