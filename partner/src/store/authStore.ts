import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Partner } from '../types';

interface AuthStore {
  user: User | null;
  partner: Partner | null;
  token: string | null;
  setAuth: (user: User, token: string, partner?: Partner) => void;
  setPartner: (partner: Partner) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null, partner: null, token: null,
      setAuth: (user, token, partner) => {
        localStorage.setItem('partner_token', token);
        set({ user, token, partner: partner ?? null });
      },
      setPartner: (partner) => set({ partner }),
      logout: () => {
        localStorage.removeItem('partner_token');
        set({ user: null, partner: null, token: null });
      },
    }),
    { name: 'partner-auth', partialize: (s) => ({ user: s.user, token: s.token, partner: s.partner }) }
  )
);
