import { create } from 'zustand';
import type { BookingFormState } from '../types';

interface BookingStore {
  step: number;
  form: BookingFormState;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateForm: (data: Partial<BookingFormState>) => void;
  resetBooking: () => void;
}

const initialForm: BookingFormState = {
  address: '',
  pincode: '',
  scheduledAt: '',
  extras: [],
  totalAmount: 0,
};

export const useBookingStore = create<BookingStore>((set) => ({
  step: 1,
  form: initialForm,
  setStep: (step) => set({ step }),
  nextStep: () => set((s) => ({ step: s.step + 1 })),
  prevStep: () => set((s) => ({ step: Math.max(1, s.step - 1) })),
  updateForm: (data) => set((s) => ({ form: { ...s.form, ...data } })),
  resetBooking: () => set({ step: 1, form: initialForm }),
}));
