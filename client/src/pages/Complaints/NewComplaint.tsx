import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquareWarning } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Button from '../../components/common/Button';

const TYPES = [
  { value: 'service_quality', label: 'Service Quality' },
  { value: 'partner_behaviour', label: 'Partner Behaviour' },
  { value: 'billing', label: 'Billing / Payment' },
  { value: 'other', label: 'Other' },
];

export default function NewComplaint() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ booking_id: '', type: 'service_quality', description: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.booking_id || !form.description.trim()) {
      toast.error('Fill all fields'); return;
    }
    if (form.description.length < 10) {
      toast.error('Description too short (min 10 characters)'); return;
    }
    setLoading(true);
    try {
      await api.post('/complaints', {
        booking_id: Number(form.booking_id),
        type: form.type,
        description: form.description,
      });
      toast.success('Complaint filed! We will respond within 24 hours.');
      navigate('/complaints');
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Failed to file complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
          <MessageSquareWarning size={20} className="text-red-500" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">File a Complaint</h1>
          <p className="text-sm text-gray-400">We respond within 24 hours</p>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Booking ID *</label>
          <input
            type="number"
            value={form.booking_id}
            onChange={e => setForm(f => ({ ...f, booking_id: e.target.value }))}
            placeholder="e.g. 1802"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <p className="text-xs text-gray-400 mt-1">Find this in your booking history</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Complaint Type *</label>
          <div className="grid grid-cols-2 gap-2">
            {TYPES.map(t => (
              <button
                key={t.value}
                type="button"
                onClick={() => setForm(f => ({ ...f, type: t.value }))}
                className={`px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors text-left ${form.type === t.value ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:border-blue-300'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description *</label>
          <textarea
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            rows={5}
            placeholder="Please describe the issue in detail..."
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <p className="text-xs text-gray-400 mt-1">{form.description.length} / 2000 characters</p>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700">
          <p className="font-semibold mb-1">What happens next?</p>
          <p>Our team will review your complaint within 24 hours and reach out via phone or email. Eligible refunds are credited to your CareLine wallet.</p>
        </div>

        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={() => navigate('/complaints')}>Cancel</Button>
          <Button type="submit" fullWidth loading={loading}>Submit Complaint</Button>
        </div>
      </form>
    </div>
  );
}
