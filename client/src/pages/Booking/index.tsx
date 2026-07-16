import { CheckCircle, Sparkles } from 'lucide-react';
import { useBookingStore } from '../../features/bookingStore';
import BookingSummary from './BookingSummary';
import CarTypeStep from './steps/CarTypeStep';
import LocationStep from './steps/LocationStep';
import DateTimeStep from './steps/DateTimeStep';
import PackageStep from './steps/PackageStep';
import ExtrasStep from './steps/ExtrasStep';
import PaymentStep from './steps/PaymentStep';

const STEPS = [
  { label: 'Car Type' },
  { label: 'Location' },
  { label: 'Date & Time' },
  { label: 'Package' },
  { label: 'Extras' },
  { label: 'Payment' },
];

const StepComponents = [CarTypeStep, LocationStep, DateTimeStep, PackageStep, ExtrasStep, PaymentStep];

export default function Booking() {
  const { step } = useBookingStore();
  const CurrentStep = StepComponents[step - 1];
  const isPaymentStep = step === STEPS.length;

  return (
    <div className="min-h-screen bg-luxuryDark-base py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Luxury Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles size={20} className="text-luxuryGold animate-pulse" />
            <span className="text-xs font-bold tracking-[0.3em] text-luxuryGold uppercase">PREMIUM BOOKING</span>
            <Sparkles size={20} className="text-luxuryGold animate-pulse" />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-white font-normal tracking-wide mb-3">
            Book a Car Wash
          </h1>
          <div className="h-0.5 w-16 bg-luxuryGold mx-auto"></div>
        </div>

        {/* Luxury Step Indicator */}
        <div className="flex items-center mb-12 max-w-4xl mx-auto relative">
          {/* Progress Line Background */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-luxuryDark-border z-0 hidden sm:block"></div>
          {/* Active Progress Line */}
          <div 
            className="absolute top-5 left-0 h-0.5 bg-luxuryGold z-0 transition-all duration-500 hidden sm:block"
            style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
          ></div>

          {STEPS.map((s, i) => {
            const num = i + 1;
            const isDone = step > num;
            const isActive = step === num;
            return (
              <div key={s.label} className="flex flex-col items-center flex-1 z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 mb-2 border-2 ${
                    isDone 
                      ? 'bg-luxuryGold border-luxuryGold text-black shadow-lg shadow-luxuryGold/30' 
                      : isActive 
                        ? 'bg-luxuryDark-base border-luxuryGold text-luxuryGold shadow-lg shadow-luxuryGold/20 ring-4 ring-luxuryGold/20' 
                        : 'bg-luxuryDark-card border-luxuryDark-border text-gray-500'
                  }`}
                >
                  {isDone ? <CheckCircle size={18} /> : num}
                </div>
                <span className={`text-[10px] sm:text-xs font-semibold tracking-wider uppercase transition-colors text-center px-1 ${
                  isActive ? 'text-luxuryGold' : isDone ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Main Content */}
        <div className={`grid grid-cols-1 gap-8 ${isPaymentStep ? 'max-w-3xl mx-auto' : 'lg:grid-cols-3'}`}>
          <div className={isPaymentStep ? '' : 'lg:col-span-2'}>
            <div className="bg-luxuryDark-card border border-luxuryDark-border rounded-sm p-8 shadow-2xl shadow-black/20 backdrop-blur-sm">
              <CurrentStep />
            </div>
          </div>

          {!isPaymentStep && (
            <div className="lg:col-span-1">
              <BookingSummary />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
