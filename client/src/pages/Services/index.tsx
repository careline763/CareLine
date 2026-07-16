import { useEffect, useState } from 'react';
import { Droplets, Wind, Sparkles, Car } from 'lucide-react';
import Loader from '../../components/common/Loader';
import { useNavigate } from 'react-router-dom';
import type { ServiceItem } from '../../types';

const MOCK_SERVICES: ServiceItem[] = [
  { id: 1, name: 'Exterior Wash', description: 'Full exterior rinse, foam wash, and wipe-down. Removes dust, bird droppings, and grime.', price: 149, category: 'exterior' },
  { id: 2, name: 'Interior Vacuum', description: 'Deep vacuum of seats, floor mats, dashboard, and boot area.', price: 199, category: 'interior' },
  { id: 3, name: 'Dashboard Polish', description: 'Dashboard, console, and door panels cleaned and polished with UV protectant.', price: 99, category: 'interior' },
  { id: 4, name: 'Tyre Dressing', description: 'Tyres cleaned and dressed for a glossy, new look.', price: 79, category: 'exterior' },
  { id: 5, name: 'Waterless Wash', description: 'Eco-friendly waterless formula. Perfect for water-scarce areas. No water required.', price: 199, category: 'waterless' },
  { id: 6, name: 'Glass Cleaning', description: 'All windows cleaned inside and out with streak-free solution.', price: 99, category: 'exterior' },
  { id: 7, name: 'Seat Sanitization', description: 'Anti-bacterial spray sanitization on all seat surfaces and fabric.', price: 149, category: 'interior' },
  { id: 8, name: 'Engine Bay Clean', description: 'Careful degreasing and cleaning of the engine bay area.', price: 299, category: 'specialty' },
];

const categoryIcon: Record<string, React.ReactNode> = {
  exterior: <Droplets size={18} className="text-luxuryGold" />,
  interior: <Sparkles size={18} className="text-luxuryGold" />,
  waterless: <Wind size={18} className="text-luxuryGold" />,
  specialty: <Car size={18} className="text-luxuryGold" />,
};

const categoryLabel: Record<string, string> = {
  exterior: 'Exterior',
  interior: 'Interior',
  waterless: 'Waterless',
  specialty: 'Specialty',
};

export default function Services() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setServices(MOCK_SERVICES);
      setLoading(false);
    }, 500);
  }, []);

  const categories = ['all', ...Array.from(new Set(services.map((s) => s.category)))];
  const filtered = activeCategory === 'all' ? services : services.filter((s) => s.category === activeCategory);

  return (
    <div className="min-h-screen bg-luxuryDark-base">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold tracking-[0.3em] text-luxuryGold uppercase block mb-3">OUR SERVICES</span>
          <h1 className="font-serif text-4xl md:text-5xl text-white font-normal tracking-wide mb-4">Premium Car Care</h1>
          <div className="h-0.5 w-16 bg-luxuryGold mx-auto mb-6"></div>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto font-light tracking-wide leading-relaxed">
            Choose individual add-on services or pick a plan that bundles everything at a discount.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex gap-3 flex-wrap justify-center mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-3 rounded-sm text-xs font-bold tracking-widest transition-all duration-300 uppercase border-2 ${
                activeCategory === cat 
                  ? 'bg-transparent border-white text-white' 
                  : 'bg-transparent border-luxuryGold text-luxuryGold hover:border-white hover:text-white'
              }`}
            >
              {cat === 'all' ? 'All Services' : categoryLabel[cat] || cat}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((service) => (
              <div 
                key={service.id} 
                className="bg-luxuryDark-card border border-luxuryDark-border/60 rounded-sm p-6 hover:border-luxuryGold/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-luxuryGold/10 flex flex-col"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="text-luxuryGold">
                    {categoryIcon[service.category]}
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    {categoryLabel[service.category] || service.category}
                  </span>
                </div>
                
                <h3 className="font-serif text-lg text-white font-normal mb-3 tracking-wide">{service.name}</h3>
                <p className="text-xs text-gray-400 leading-relaxed font-light flex-1 mb-6">{service.description}</p>
                
                <div className="flex items-center justify-between mb-6 pt-4 border-t border-luxuryDark-border/60">
                  <span className="font-serif text-3xl text-luxuryGold font-medium">₹{service.price}</span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider">/service</span>
                </div>

                <button
                  onClick={() => navigate('/book')}
                  className="w-full py-3.5 text-sm font-bold tracking-[0.2em] uppercase rounded-md transition-all duration-300 bg-transparent border-2 border-luxuryGold text-luxuryGold hover:bg-luxuryGold hover:text-black"
                >
                  BOOK NOW
                </button>
              </div>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center bg-luxuryDark-card border border-luxuryDark-border rounded-sm p-8">
          <p className="text-gray-400 text-sm mb-6 font-light tracking-wide">
            Want everything bundled? Check out our plans and save up to 40%.
          </p>
          <button
            onClick={() => navigate('/plans')}
            className="px-8 py-4 text-sm font-bold tracking-[0.2em] uppercase rounded-md transition-all duration-300 bg-transparent border-2 border-luxuryGold text-luxuryGold hover:bg-luxuryGold hover:text-black"
          >
            VIEW ALL PLANS
          </button>
        </div>
      </div>
    </div>
  );
}
