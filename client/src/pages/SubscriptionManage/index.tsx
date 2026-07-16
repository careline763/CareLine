import { useEffect, useState } from 'react';
import { Pause, Play, X, Calendar, RefreshCw } from 'lucide-react';
import { useSubscriptionStore } from '../../features/subscriptionStore';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { Subscription } from '../../types';

const STATUS_BADGE: Record<Subscription['status'], string> = {
  active: 'bg-green-100 text-green-700',
  paused: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
};

const PLAN_NAMES: Record<number, string> = { 1: 'One-Time Wash', 2: 'Weekly Plan', 3: 'Monthly Pro' };

const MOCK_SUBS: Subscription[] = [
  { id: 1, user_id: 1, plan_id: 3, status: 'active', next_billing_date: new Date(Date.now() + 86400000 * 12).toISOString(), missed_credits: 0 },
  { id: 2, user_id: 1, plan_id: 2, status: 'paused', next_billing_date: new Date(Date.now() + 86400000 * 5).toISOString(), missed_credits: 2 },
];

export default function SubscriptionManage() {
  const { subscriptions, loading, pause, resume, cancel } = useSubscriptionStore();
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [cancelModal, setCancelModal] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    setTimeout(() => setSubs(MOCK_SUBS), 400);
  }, []);

  const handlePause = async (id: number) => {
    setActionLoading(id);
    try {
      setSubs((s) => s.map((sub) => sub.id === id ? { ...sub, status: 'paused' } : sub));
      toast.success('Subscription paused');
    } finally {
      setActionLoading(null);
    }
  };

  const handleResume = async (id: number) => {
    setActionLoading(id);
    try {
      setSubs((s) => s.map((sub) => sub.id === id ? { ...sub, status: 'active' } : sub));
      toast.success('Subscription resumed');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (id: number) => {
    setSubs((s) => s.map((sub) => sub.id === id ? { ...sub, status: 'cancelled' } : sub));
    setCancelModal(null);
    toast.success('Subscription cancelled');
  };

  if (loading && subs.length === 0) return <Loader fullPage />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Subscriptions</h1>
        <Link to="/plans"><Button size="sm" variant="outline">+ Add Plan</Button></Link>
      </div>

      {subs.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 mb-4">No active subscriptions.</p>
          <Link to="/plans"><Button>Browse Plans</Button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subs.map((sub) => (
            <div key={sub.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{PLAN_NAMES[sub.plan_id] || `Plan #${sub.plan_id}`}</h3>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize mt-1 inline-block ${STATUS_BADGE[sub.status]}`}>
                    {sub.status}
                  </span>
                </div>
                {sub.missed_credits > 0 && (
                  <div className="flex items-center gap-1 bg-orange-50 text-orange-600 text-xs font-medium px-2.5 py-1 rounded-full">
                    <RefreshCw size={11} /> {sub.missed_credits} missed credits
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
                <Calendar size={13} />
                Next billing: {new Date(sub.next_billing_date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
              </div>

              {sub.status !== 'cancelled' && (
                <div className="flex gap-2">
                  {sub.status === 'active' ? (
                    <Button
                      size="sm" variant="outline"
                      loading={actionLoading === sub.id}
                      onClick={() => handlePause(sub.id)}
                    >
                      <Pause size={13} /> Pause
                    </Button>
                  ) : sub.status === 'paused' ? (
                    <Button
                      size="sm"
                      loading={actionLoading === sub.id}
                      onClick={() => handleResume(sub.id)}
                    >
                      <Play size={13} /> Resume
                    </Button>
                  ) : null}
                  <Button size="sm" variant="danger" onClick={() => setCancelModal(sub.id)}>
                    <X size={13} /> Cancel
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal open={cancelModal !== null} onClose={() => setCancelModal(null)} title="Cancel Subscription">
        <p className="text-sm text-gray-500 mb-6">Are you sure you want to cancel? You'll lose access to your remaining washes this billing period.</p>
        <div className="flex gap-3">
          <Button variant="outline" fullWidth onClick={() => setCancelModal(null)}>Keep Subscription</Button>
          <Button variant="danger" fullWidth onClick={() => cancelModal && handleCancel(cancelModal)}>Yes, Cancel</Button>
        </div>
      </Modal>
    </div>
  );
}
