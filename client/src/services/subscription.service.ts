import api from './api';
import type { Subscription } from '../types';

export const getSubscriptions = () => api.get<Subscription[]>('/subscriptions');

export const pauseSubscription = (id: number) =>
  api.post(`/subscriptions/${id}/pause`);

export const resumeSubscription = (id: number) =>
  api.post(`/subscriptions/${id}/resume`);

export const cancelSubscription = (id: number) =>
  api.delete(`/subscriptions/${id}`);
