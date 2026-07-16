import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FleetUser { id: number; name: string; phone: string; fleetId: number; fleetName: string }

interface AuthState {
  user: FleetUser | null;
  token: string | null;
  login: (user: FleetUser, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (user, token) => {
        localStorage.setItem('fleet_token', token);
        set({ user, token });
      },
      logout: () => {
        localStorage.removeItem('fleet_token');
        set({ user: null, token: null });
      },
    }),
    { name: 'fleet-auth' }
  )
);
