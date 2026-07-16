import { Bell } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function Topbar({ title }: { title: string }) {
  const { user } = useAuthStore();
  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
      <h1 className="text-base font-semibold text-gray-900">{title}</h1>
      <div className="flex items-center gap-3">
        <button className="relative text-gray-400 hover:text-gray-600">
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
        </button>
        <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
            {user?.name?.charAt(0) ?? 'A'}
          </div>
          {user?.name ?? 'Admin'}
        </div>
      </div>
    </header>
  );
}
