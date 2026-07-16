import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Star } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';
import api from '../../services/api';

export default function Reviews() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (!bookingId) navigate('/bookings', { replace: true });
  }, [bookingId, navigate]);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!rating) return toast.error('Please select a rating');
    setLoading(true);
    try {
      await api.post('/reviews', { booking_id: bookingId, rating, comment });
      toast.success('Thank you for your review!');
      navigate('/bookings');
    } catch {
      toast.error('Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const labels = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'];

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="text-4xl mb-4">🚗✨</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">How was your wash?</h1>
        <p className="text-gray-400 text-sm mb-8">Your feedback helps us improve and rewards great partners.</p>

        <div className="flex justify-center gap-2 mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setRating(star)}
              className="transition-transform hover:scale-110"
            >
              <Star
                size={36}
                className={`${(hovered || rating) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} transition-colors`}
              />
            </button>
          ))}
        </div>

        {(hovered || rating) > 0 && (
          <p className="text-sm font-medium text-gray-600 mb-6">{labels[hovered || rating]}</p>
        )}

        <textarea
          rows={4}
          placeholder="Tell us more about your experience (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 mb-6 text-left"
        />

        <Button fullWidth size="lg" loading={loading} onClick={handleSubmit}>
          Submit Review
        </Button>

        <button onClick={() => navigate('/bookings')} className="block mt-3 mx-auto text-xs text-gray-400 hover:underline">
          Skip for now
        </button>
      </div>
    </div>
  );
}
