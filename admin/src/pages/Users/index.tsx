import { useEffect, useState } from 'react';
import { Search, Eye, Ban, CheckCircle, Phone, Mail, Car, Calendar } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Loader from '../../components/ui/Loader';
import type { User } from '../../types';
import toast from 'react-hot-toast';

interface UserWithMeta extends User {
  total_bookings: number;
  total_spent: number;
  vehicles_count: number;
  is_banned?: boolean;
}

const MOCK_USERS: UserWithMeta[] = [
  { id: 1, name: 'Priya Sharma', phone: '9876543210', email: 'priya@example.com', role: 'customer', created_at: new Date(Date.now() - 7776000000).toISOString(), total_bookings: 24, total_spent: 18750, vehicles_count: 2, is_banned: false },
  { id: 2, name: 'Rahul Verma', phone: '9123456789', email: 'rahul@example.com', role: 'customer', created_at: new Date(Date.now() - 5184000000).toISOString(), total_bookings: 8, total_spent: 3200, vehicles_count: 1, is_banned: false },
  { id: 3, name: 'Anjali Singh', phone: '9988776655', email: undefined, role: 'customer', created_at: new Date(Date.now() - 3456000000).toISOString(), total_bookings: 15, total_spent: 12450, vehicles_count: 1, is_banned: false },
  { id: 4, name: 'Amit Patel', phone: '9765432100', email: 'amit@example.com', role: 'customer', created_at: new Date(Date.now() - 2592000000).toISOString(), total_bookings: 31, total_spent: 28900, vehicles_count: 3, is_banned: false },
  { id: 5, name: 'Neha Gupta', phone: '9345678901', email: undefined, role: 'customer', created_at: new Date(Date.now() - 1728000000).toISOString(), total_bookings: 3, total_spent: 747, vehicles_count: 1, is_banned: true },
  { id: 6, name: 'Suresh Iyer', phone: '9234567890', email: 'suresh@example.com', role: 'customer', created_at: new Date(Date.now() - 1296000000).toISOString(), total_bookings: 19, total_spent: 15200, vehicles_count: 2, is_banned: false },
  { id: 7, name: 'Kavitha Reddy', phone: '9456789123', email: 'kavitha@example.com', role: 'customer', created_at: new Date(Date.now() - 864000000).toISOString(), total_bookings: 7, total_spent: 4200, vehicles_count: 1, is_banned: false },
  { id: 8, name: 'Rajan Kumar', phone: '9812345678', email: undefined, role: 'partner', created_at: new Date(Date.now() - 2160000000).toISOString(), total_bookings: 0, total_spent: 0, vehicles_count: 0, is_banned: false },
];

export default function Users() {
  const [users, setUsers] = useState<UserWithMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selected, setSelected] = useState<UserWithMeta | null>(null);

  useEffect(() => {
    setTimeout(() => { setUsers(MOCK_USERS); setLoading(false); }, 400);
  }, []);

  const filtered = users.filter(u => {
    const matchSearch = !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.includes(search) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const toggleBan = (id: number) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, is_banned: !u.is_banned } : u));
    const u = users.find(u => u.id === id);
    toast.success(u?.is_banned ? `${u.name} unbanned` : `${u?.name} banned`);
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, is_banned: !prev.is_banned } : null);
  };

  const counts = {
    total: users.length,
    customers: users.filter(u => u.role === 'customer').length,
    partners: users.filter(u => u.role === 'partner').length,
    banned: users.filter(u => u.is_banned).length,
  };

  return (
    <AdminLayout title="Users">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Users', value: counts.total, cls: 'text-indigo-600' },
          { label: 'Customers', value: counts.customers, cls: 'text-blue-600' },
          { label: 'Partners', value: counts.partners, cls: 'text-emerald-600' },
          { label: 'Banned', value: counts.banned, cls: 'text-red-600' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
            <div className={`text-2xl font-bold ${c.cls}`}>{c.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{c.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, phone or email…"
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
          />
        </div>
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none bg-white"
        >
          <option value="all">All Roles</option>
          <option value="customer">Customers</option>
          <option value="partner">Partners</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {loading ? <Loader /> : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100">
            <span className="text-xs text-gray-500">{filtered.length} users</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['User', 'Contact', 'Role', 'Bookings', 'Total Spent', 'Vehicles', 'Joined', 'Status', ''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id} className={`border-b border-gray-50 last:border-0 transition-colors ${u.is_banned ? 'bg-red-50/40' : 'hover:bg-gray-50'}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${u.is_banned ? 'bg-red-100 text-red-500' : 'bg-indigo-100 text-indigo-600'}`}>
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{u.name}</p>
                          <p className="text-xs text-gray-400">#{u.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-gray-600 text-xs mb-0.5">
                        <Phone size={10} /> {u.phone}
                      </div>
                      {u.email && (
                        <div className="flex items-center gap-1 text-gray-400 text-xs">
                          <Mail size={10} /> {u.email}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3"><Badge label={u.role} /></td>
                    <td className="px-4 py-3 text-gray-700 font-medium">{u.total_bookings}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      {u.total_spent > 0 ? `₹${u.total_spent.toLocaleString('en-IN')}` : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-gray-500 text-xs">
                        <Car size={11} /> {u.vehicles_count}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {new Date(u.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                    </td>
                    <td className="px-4 py-3">
                      <Badge label={u.is_banned ? 'cancelled' : 'active'} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <Button size="sm" variant="ghost" onClick={() => setSelected(u)}>
                          <Eye size={13} />
                        </Button>
                        <Button
                          size="sm"
                          variant={u.is_banned ? 'success' : 'danger'}
                          onClick={() => toggleBan(u.id)}
                        >
                          {u.is_banned ? <CheckCircle size={12} /> : <Ban size={12} />}
                          {u.is_banned ? 'Unban' : 'Ban'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* User detail modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={`User: ${selected?.name}`}>
        {selected && (
          <div className="space-y-4">
            {/* Avatar + name */}
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold ${selected.is_banned ? 'bg-red-100 text-red-500' : 'bg-indigo-100 text-indigo-600'}`}>
                {selected.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-base">{selected.name}</p>
                <Badge label={selected.role} />
                {selected.is_banned && <span className="ml-2 text-xs text-red-500 font-medium">• Banned</span>}
              </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ['Phone', selected.phone],
                ['Email', selected.email || '—'],
                ['Total Bookings', selected.total_bookings],
                ['Total Spent', selected.total_spent > 0 ? `₹${selected.total_spent.toLocaleString('en-IN')}` : '—'],
                ['Vehicles', selected.vehicles_count],
                ['Joined', new Date(selected.created_at).toLocaleDateString('en-IN', { dateStyle: 'long' })],
              ].map(([k, v]) => (
                <div key={String(k)}>
                  <p className="text-xs text-gray-400 mb-0.5">{k}</p>
                  <p className="font-medium text-gray-900">{String(v)}</p>
                </div>
              ))}
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              {[
                { icon: Calendar, label: 'Bookings', val: selected.total_bookings },
                { icon: Car, label: 'Vehicles', val: selected.vehicles_count },
                { icon: CheckCircle, label: 'Avg/Booking', val: selected.total_bookings > 0 ? `₹${Math.round(selected.total_spent / selected.total_bookings)}` : '—' },
              ].map(({ icon: Icon, label, val }) => (
                <div key={label} className="bg-gray-50 rounded-lg p-3 text-center">
                  <Icon size={16} className="text-indigo-500 mx-auto mb-1" />
                  <p className="text-sm font-bold text-gray-900">{val}</p>
                  <p className="text-xs text-gray-400">{label}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" fullWidth onClick={() => setSelected(null)}>Close</Button>
              <Button
                fullWidth
                variant={selected.is_banned ? 'success' : 'danger'}
                onClick={() => toggleBan(selected.id)}
              >
                {selected.is_banned ? <><CheckCircle size={14} /> Unban User</> : <><Ban size={14} /> Ban User</>}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}
