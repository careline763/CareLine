import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ChevronRight, Plus } from 'lucide-react';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import type { Booking } from '../../types';

const STATUS_STYLE: Record<string, { bg: string; text: string }> = {
  pending_payment: { bg: 'bg-yellow-500/10', text: 'text-yellow-400' },
  confirmed: { bg: 'bg-blue-500/10', text: 'text-blue-400' },
  assigned: { bg: 'bg-indigo-500/10', text: 'text-indigo-400' },
  en_route: { bg: 'bg-purple-500/10', text: 'text-purple-400' },
  started: { bg: 'bg-orange-500/10', text: 'text-orange-400' },
  completed: { bg: 'bg-green-500/10', text: 'text-green-400' },
  cancelled: { bg: 'bg-red-500/10', text: 'text-red-400' },
};

const MOCK_BOOKINGS: Booking[] = [
  {
    id: 1, user_id: 1, vehicle_id: 1, plan_id: 3, address: 'B-204, Sunrise Apartments, Andheri West', pincode: '400053',
    scheduled_at: new Date(Date.now() + 3600000 * 2).toISOString(), status: 'assigned', total_amount: 1499,
    partner_id: 5,
  },
  {
    id: 2, user_id: 1, vehicle_id: 1, plan_id: 1, address: 'B-204, Sunrise Apartments, Andheri West', pincode: '400053',
    scheduled_at: new Date(Date.now() - 86400000).toISOString(), status: 'completed', total_amount: 249,
  },
];

export default function BookingList() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => { setBookings(MOCK_BOOKINGS); setLoading(false); }, 500);
  }, []);

  if (loading) return <Loader fullPage />;

  return (
    <div className="min-h-screen bg-luxuryDark-base py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <span className="text-xs font-bold tracking-[0.3em] text-luxuryGold uppercase block mb-3">YOUR BOOKINGS</span>
            <h1 className="font-serif text-4xl text-white font-normal tracking-wide">My Bookings</h1>
          </div>
          <Link to="/book">
            <Button size="md">
              <Plus size={16} />
              New Booking
            </Button>
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-20 bg-luxuryDark-card border border-luxuryDark-border/60 rounded-sm">
            <p className="text-gray-400 mb-6 text-sm tracking-wider">No bookings yet. Start your first wash!</p>
            <Link to="/book">
              <Button>Book Your First Wash</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {bookings.map((b) => (
              <div 
                key={b.id} 
                className="bg-luxuryDark-card border border-luxuryDark-border/60 rounded-sm p-6 hover:border-luxuryGold/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-luxuryGold/10"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Status and ID */}
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`text-[10px] font-bold px-3 py-1.5 rounded-sm capitalize tracking-wider border ${STATUS_STYLE[b.status].bg} ${STATUS_STYLE[b.status].text} border-current/20`}>
                        {b.status.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-gray-600">#{b.id}</span>
                    </div>

                    {/* Date/Time */}
                    <div className="flex items-center gap-2 text-sm text-gray-300 mb-3">
                      <Calendar size={14} className="text-luxuryGold" />
                      <span className="font-medium">
                        {new Date(b.scheduled_at).toLocaleString('en-IN', { 
                          dateStyle: 'medium', 
                          timeStyle: 'short' 
                        })}
                      </span>
                    </div>

                    {/* Address */}
                    <div className="flex items-start gap-2 text-sm text-gray-400">
                      <MapPin size={14} className="text-luxuryGold mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{b.address}</span>
                    </div>
                  </div>

                  {/* Price and Actions */}
                  <div className="text-right ml-6">
                    <div className="font-serif text-2xl text-luxuryGold font-medium mb-2">
                      ₹{b.total_amount}
                    </div>
                    
                    {(b.status === 'assigned' || b.status === 'en_route' || b.status === 'started') && (
                      <Link 
                        to={`/track/${b.id}`} 
                        className="text-xs text-luxuryGold font-bold hover:text-luxuryGold-light flex items-center gap-1 justify-end uppercase tracking-wider transition-colors group"
                      >
                        Track 
                        <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    )}
                    
                    {b.status === 'completed' && (
                      <Link 
                        to={`/reviews/${b.id}`} 
                        className="text-xs text-green-400 font-bold hover:text-green-300 flex items-center gap-1 justify-end uppercase tracking-wider transition-colors group"
                      >
                        Rate 
                        <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
