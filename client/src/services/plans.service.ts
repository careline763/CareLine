import api from './api';
import type { Plan, ServiceItem, ServiceArea } from '../types';

export const getPlans = () => api.get<Plan[]>('/plans');
export const getPlanById = (id: number) => api.get<Plan>(`/plans/${id}`);
export const getServices = () => api.get<ServiceItem[]>('/services');
export const checkPincode = (pincode: string) =>
  api.get<ServiceArea>(`/service-areas/${pincode}`);
