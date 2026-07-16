import api from './api';

export const sendOTP = (phone: string) =>
  api.post('/auth/otp/send', { phone });

export const verifyOTP = (phone: string, otp: string) =>
  api.post<{ access_token: string; user: object }>('/auth/otp/verify', { phone, otp });

export const getMe = () => api.get('/auth/me');
