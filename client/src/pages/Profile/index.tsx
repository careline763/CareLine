import { useState } from 'react';
import { User, Car, ChevronRight, LifeBuoy, Plus, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../features/authStore';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

const MOCK_VEHICLES = [
  { id: 1, type: 'sedan', model: 'Honda City', plate_number: 'MH02AB1234' },
  { id: 2, type: 'suv', model: 'Hyundai Creta', plate_number: 'MH02CD5678' },
];

export default function Profile() {
  const { user } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleSave = () => {
    toast.success('Profile updated successfully!');
  };

  return (
    <div className="min-h-screen bg-luxuryDark-base py-16">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="mb-10">
          <span className="text-xs font-bold tracking-[0.3em] text-luxuryGold uppercase block mb-3">ACCOUNT SETTINGS</span>
          <h1 className="font-serif text-4xl text-white font-normal tracking-wide">My Profile</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Profile Info Card */}
          <div className="bg-luxuryDark-card border border-luxuryDark-border/60 rounded-sm p-8 hover:border-luxuryGold/40 transition-all duration-300">
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-luxuryDark-border/60">
              <div className="w-16 h-16 rounded-full bg-luxuryGold/10 border border-luxuryGold/20 flex items-center justify-center flex-shrink-0">
                <User size={28} className="text-luxuryGold" />
              </div>
              <div>
                <p className="font-serif text-xl text-white font-normal tracking-wide">{user?.name || 'User'}</p>
                <p className="text-sm text-gray-400 flex items-center gap-1.5 mt-1">
                  <Phone size={12} />
                  +91 {user?.phone}
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wider">Full Name</label>
                <input
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-luxuryDark-input border border-luxuryDark-border text-white text-sm rounded-sm focus:outline-none focus:ring-2 focus:ring-luxuryGold focus:border-luxuryGold transition-all"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wider">
                  Email Address <span className="text-gray-600">(Optional)</span>
                </label>
                <input
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-luxuryDark-input border border-luxuryDark-border text-white text-sm rounded-sm focus:outline-none focus:ring-2 focus:ring-luxuryGold focus:border-luxuryGold transition-all"
                  placeholder="your@email.com"
                />
              </div>
              <Button size="md" onClick={handleSave} fullWidth>
                Save Changes
              </Button>
            </div>
          </div>

          {/* Vehicles Card */}
          <div className="bg-luxuryDark-card border border-luxuryDark-border/60 rounded-sm p-8 hover:border-luxuryGold/40 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl text-white font-normal tracking-wide flex items-center gap-2">
                <Car size={20} className="text-luxuryGold" /> 
                My Vehicles
              </h2>
              <button className="text-xs text-luxuryGold font-bold hover:text-luxuryGold-light flex items-center gap-1 uppercase tracking-wider transition-colors">
                <Plus size={14} /> Add
              </button>
            </div>
            
            <div className="space-y-4">
              {MOCK_VEHICLES.map((v) => (
                <div 
                  key={v.id} 
                  className="flex items-center justify-between py-4 px-4 bg-luxuryDark-input border border-luxuryDark-border/40 rounded-sm hover:border-luxuryGold/40 transition-all duration-300 cursor-pointer group"
                >
                  <div>
                    <p className="text-sm font-semibold text-white mb-1">{v.model}</p>
                    <p className="text-xs text-gray-500 capitalize tracking-wider">
                      {v.type} <span className="text-gray-600">·</span> {v.plate_number}
                    </p>
                  </div>
                  <ChevronRight size={18} className="text-gray-600 group-hover:text-luxuryGold transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Links Card */}
        <div className="bg-luxuryDark-card border border-luxuryDark-border/60 rounded-sm p-6 max-w-md hover:border-luxuryGold/40 transition-all duration-300">
          <h3 className="font-serif text-lg text-white font-normal mb-4 tracking-wide">Quick Links</h3>
          <div className="space-y-2">
            <Link 
              to="/support" 
              className="flex items-center justify-between py-3 px-4 hover:bg-luxuryDark-input rounded-sm transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 text-sm font-medium text-gray-300 group-hover:text-luxuryGold">
                <LifeBuoy size={18} className="text-gray-500 group-hover:text-luxuryGold" /> 
                Help & Support
              </div>
              <ChevronRight size={16} className="text-gray-600 group-hover:text-luxuryGold" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
