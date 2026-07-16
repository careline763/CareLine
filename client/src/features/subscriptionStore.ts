import { create } from 'zustand';
import type { Subscription } from '../types';
import * as subService from '../services/subscription.service';

interface SubscriptionStore {
  subscriptions: Subscription[];
  loading: boolean;
  fetch: () => Promise<void>;
  pause: (id: number) => Promise<void>;
  resume: (id: number) => Promise<void>;
  cancel: (id: number) => Promise<void>;
}

export const useSubscriptionStore = create<SubscriptionStore>((set, get) => ({
  subscriptions: [],
  loading: false,
  fetch: async () => {
    set({ loading: true });
    const { data } = await subService.getSubscriptions();
    set({ subscriptions: data, loading: false });
  },
  pause: async (id) => {
    await subService.pauseSubscription(id);
    set((s) => ({
      subscriptions: s.subscriptions.map((sub) =>
        sub.id === id ? { ...sub, status: 'paused' } : sub
      ),
    }));
  },
  resume: async (id) => {
    await subService.resumeSubscription(id);
    set((s) => ({
      subscriptions: s.subscriptions.map((sub) =>
        sub.id === id ? { ...sub, status: 'active' } : sub
      ),
    }));
  },
  cancel: async (id) => {
    await subService.cancelSubscription(id);
    await get().fetch();
  },
}));
