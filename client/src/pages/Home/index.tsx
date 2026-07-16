import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { 
  CheckCircle, Clock, Shield, Star, Droplets, Car, ChevronRight, Sparkles,
  Award, Users, MapPin, TrendingUp, Zap, Heart, CalendarCheck, Phone
} from 'lucide-react';
import Button from '../../components/common/Button';

const features = [
  { icon: Clock, title: 'Doorstep Service', desc: 'We come to your home, office, or society — no need to go anywhere.' },
  { icon: Shield, title: 'Verified Partners', desc: 'Every cleaner is background-checked, trained, and rated by customers.' },
  { icon: Droplets, title: 'Eco-Friendly', desc: 'Waterless options available for water-scarce zones across India.' },
  { icon: Star, title: 'Daily Plans', desc: 'Subscribe for daily, weekly, or monthly cleans at unbeatable prices.' },
];

const stats = [
  { value: '10,000+', label: 'Happy Customers' },
  { value: '500+', label: 'Verified Partners' },
  { value: '50+', label: 'Cities' },
  { value: '4.8★', label: 'Average Rating' },
];

const howItWorks = [
  { step: '01', title: 'Book a Plan', desc: 'Choose from one-time, weekly, or monthly plans based on your needs.' },
  { step: '02', title: 'We Assign a Partner', desc: 'A verified cleaner nearest to you is assigned instantly.' },
  { step: '03', title: 'Track in Real-Time', desc: 'Watch your partner arrive and complete the job live on the app.' },
  { step: '04', title: 'Before & After Photos', desc: 'Get proof of service with photos uploaded at job completion.' },
];

const services = [
  {
    title: 'Express Wash',
    price: '₹199',
    duration: '20 mins',
    features: ['Exterior wash', 'Tire cleaning', 'Window wipe', 'Dashboard dust'],
    popular: false,
  },
  {
    title: 'Premium Detailing',
    price: '₹599',
    duration: '45 mins',
    features: ['Complete exterior', 'Interior vacuum', 'Dashboard polish', 'Tire shine', 'Air freshener'],
    popular: true,
  },
  {
    title: 'Luxury Full Service',
    price: '₹999',
    duration: '90 mins',
    features: ['Deep exterior wash', 'Complete interior detailing', 'Engine bay cleaning', 'Wax & polish', 'Leather conditioning'],
    popular: false,
  },
];

const testimonials = [
  {
    name: 'Rajesh K.',
    role: 'BMW Owner',
    rating: 5,
    text: 'Outstanding service! The attention to detail is incredible. My car looks brand new after every wash. The monthly subscription is worth every rupee.',
    initial: 'RK',
  },
  {
    name: 'Priya S.',
    role: 'Audi Owner',
    rating: 5,
    text: 'Best car cleaning service I have ever used. Completely transparent, prompt, and no hassle. Highly recommend for premium vehicle care!',
    initial: 'PS',
  },
  {
    name: 'Amit M.',
    role: 'Mercedes Owner',
    rating: 5,
    text: 'They gave me excellent service and the convenience of doorstep cleaning is unmatched. The waterless option is perfect for Bangalore.',
    initial: 'AM',
  },
];

const coverage = [
  { city: 'Bangalore', partners: '150+', status: 'Active' },
  { city: 'Mumbai', partners: '120+', status: 'Active' },
  { city: 'Delhi NCR', partners: '100+', status: 'Active' },
  { city: 'Hyderabad', partners: '80+', status: 'Active' },
  { city: 'Pune', partners: '60+', status: 'Active' },
  { city: 'Chennai', partners: '70+', status: 'Active' },
];

export default function Home() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
        }
      });
    }, observerOptions);

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const setSectionRef = (id: string) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
  };

  return (
    <div className="bg-luxuryDark-base overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-black overflow-hidden py-16">
        {/* Dramatic Ambient Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-luxuryDark-base via-transparent to-black/80 z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-luxuryDark-base/90 via-transparent to-luxuryDark-base/20 z-10"></div>

        {/* Hero Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <img 
            src="https://images.unsplash.com/photo-1619405399517-d7fce0f13302?q=80&w=1920&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-30 select-none pointer-events-none" 
            alt="Luxury car with premium detailing"
            onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1920&auto=format&fit=crop'; }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-20 pt-10">
          <div className="max-w-2xl lg:max-w-3xl">
            {/* Golden Prefix */}
            <p className="text-xs font-bold tracking-[0.4em] text-luxuryGold uppercase mb-4 opacity-0 transform translate-y-4 animate-[fadeInUp_0.8s_ease_forwards_0.2s]">
              E X C E L L E N C E &nbsp; I N &nbsp; C A R E
            </p>

            {/* Title */}
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white leading-tight font-normal tracking-wide opacity-0 transform translate-y-4 animate-[fadeInUp_0.8s_ease_forwards_0.4s]">
              Your Car.<br />
              <span className="italic font-light">Spotless.</span><br />
              Daily.
            </h1>

            {/* Subheading */}
            <p className="mt-6 text-base md:text-lg text-gray-400 font-light max-w-md leading-relaxed tracking-wider opacity-0 transform translate-y-4 animate-[fadeInUp_0.8s_ease_forwards_0.6s]">
              Professional doorstep car cleaning with luxury-grade attention to detail. Subscribe once, stay pristine every day.
            </p>

            {/* Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 opacity-0 transform translate-y-4 animate-[fadeInUp_0.8s_ease_forwards_0.8s]">
              <button
                onClick={() => navigate('/book')}
                className="px-8 py-4 text-xs font-bold tracking-[0.2em] bg-luxuryGold hover:bg-luxuryGold-light text-black text-center transition-all duration-300 uppercase rounded-sm shadow-lg shadow-luxuryGold/10 hover:shadow-luxuryGold/20 flex items-center justify-center gap-2"
              >
                Book a Wash Today
                <ChevronRight size={16} />
              </button>
              <button
                onClick={() => navigate('/plans')}
                className="px-8 py-4 text-xs font-bold tracking-[0.2em] border border-gray-600 hover:border-luxuryGold hover:text-luxuryGold text-white text-center transition-all duration-300 uppercase rounded-sm bg-black/40 backdrop-blur-sm"
              >
                View Plans & Pricing
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="relative z-20 border-y border-luxuryDark-border bg-[#0E0E0E] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:divide-x md:divide-luxuryDark-border/80">
            {stats.map((s, index) => (
              <div 
                key={s.label} 
                className="p-2 transform hover:scale-110 transition-transform duration-300 cursor-pointer group"
                style={{
                  animation: `fadeInUp 0.8s ease forwards ${0.2 + index * 0.1}s`,
                  opacity: 0
                }}
              >
                <span className="block font-serif text-3xl lg:text-4xl text-luxuryGold font-medium group-hover:text-luxuryGold-light transition-colors">{s.value}</span>
                <span className="block text-[10px] tracking-widest text-gray-400 uppercase mt-2 group-hover:text-gray-300 transition-colors">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose CareLine */}
      <section 
        id="features"
        ref={setSectionRef('features')}
        className="py-24 border-t border-luxuryDark-border bg-luxuryDark-base"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Intro Text */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs font-bold tracking-[0.3em] text-luxuryGold uppercase block mb-3">WHY CHOOSE CARELINE</span>
            <h2 className="font-serif text-3xl md:text-5xl text-white font-normal tracking-wide leading-tight">
              More Than Clean.<br />It's Commitment.
            </h2>
            <div className="h-0.5 w-16 bg-luxuryGold mx-auto mt-6"></div>
            <p className="mt-6 text-gray-400 text-sm md:text-base font-light tracking-wide leading-relaxed">
              We deliver a premium custom-tailored car care journey from start to finish. Our philosophy revolves around transparency, pristine craftsmanship, and building lifetime relationships.
            </p>
          </div>

          {/* 4 Column Value Proposition Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map(({ icon: Icon, title, desc }, index) => (
              <div 
                key={title} 
                className={`bg-luxuryDark-card border border-luxuryDark-border/60 p-8 rounded-sm hover:border-luxuryGold/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-luxuryGold/10 group cursor-pointer transform ${
                  isVisible.features 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-12 opacity-0'
                }`}
                style={{ 
                  transitionDelay: `${index * 150}ms`,
                  transitionProperty: 'all'
                }}
              >
                <div className="text-luxuryGold text-3xl mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                  <Icon size={32} />
                </div>
                <h3 className="font-serif text-lg text-white font-normal mb-3 tracking-wide group-hover:text-luxuryGold transition-colors">{title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed tracking-wider font-light">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Services Section */}
      <section 
        id="services"
        ref={setSectionRef('services')}
        className="py-24 bg-[#0E0E0E] border-t border-luxuryDark-border"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs font-bold tracking-[0.3em] text-luxuryGold uppercase block mb-3">CURATED SERVICES</span>
            <h2 className="font-serif text-3xl md:text-5xl text-white font-normal tracking-wide">
              Choose Your Perfect Service
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div 
                key={service.title}
                className={`relative bg-luxuryDark-card border rounded-sm p-8 hover:border-luxuryGold/40 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-luxuryGold/20 transform flex flex-col ${
                  service.popular ? 'border-luxuryGold shadow-lg shadow-luxuryGold/10' : 'border-luxuryDark-border/60'
                } ${
                  isVisible.services 
                    ? 'scale-100 opacity-100' 
                    : 'scale-95 opacity-0'
                }`}
                style={{ 
                  transitionDelay: `${index * 200}ms`,
                  transitionProperty: 'all'
                }}
              >
                {service.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-luxuryGold text-black text-[9px] font-bold tracking-widest uppercase px-4 py-1 rounded-sm">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="font-serif text-2xl text-white font-normal mb-2 tracking-wide">{service.title}</h3>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="font-serif text-4xl text-luxuryGold font-medium">{service.price}</span>
                    <span className="text-xs text-gray-400">/ service</span>
                  </div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-2">
                    <Clock size={10} className="inline mr-1" />
                    {service.duration}
                  </p>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {service.features.map((feature) => (
                    <li key={feature} className="text-xs text-gray-400 flex items-center gap-2">
                      <CheckCircle size={14} className="text-luxuryGold flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => navigate('/book')}
                  className="w-full py-3.5 text-sm font-bold tracking-[0.2em] uppercase rounded-md transition-all duration-300 bg-transparent border-2 border-luxuryGold text-luxuryGold hover:bg-luxuryGold hover:text-black"
                >
                  BOOK NOW
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section 
        id="howItWorks"
        ref={setSectionRef('howItWorks')}
        className="py-24 bg-luxuryDark-base border-t border-luxuryDark-border"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs font-bold tracking-[0.3em] text-luxuryGold uppercase block mb-3">HOW IT WORKS</span>
            <h2 className="font-serif text-3xl md:text-5xl text-white font-normal tracking-wide">
              Simple. Swift. Spotless.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map(({ step, title, desc }, index) => (
              <div 
                key={step} 
                className={`text-center group cursor-pointer transition-all duration-500 transform ${
                  isVisible.howItWorks 
                    ? 'translate-x-0 opacity-100' 
                    : index % 2 === 0 ? '-translate-x-12 opacity-0' : 'translate-x-12 opacity-0'
                }`}
                style={{ 
                  transitionDelay: `${index * 150}ms`,
                  transitionProperty: 'all'
                }}
              >
                <div className="font-serif text-6xl font-light text-luxuryGold/20 mb-3 group-hover:text-luxuryGold/40 group-hover:scale-110 transition-all duration-300">{step}</div>
                <h3 className="font-serif text-lg text-white font-normal mb-2 tracking-wide group-hover:text-luxuryGold transition-colors">{title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed tracking-wider font-light">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage Section */}
      <section 
        id="coverage"
        ref={setSectionRef('coverage')}
        className="py-24 bg-[#0E0E0E] border-t border-luxuryDark-border"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs font-bold tracking-[0.3em] text-luxuryGold uppercase block mb-3">NATIONWIDE COVERAGE</span>
            <h2 className="font-serif text-3xl md:text-5xl text-white font-normal tracking-wide">
              Serving India's<br />Premier Cities
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {coverage.map((item, index) => (
              <div 
                key={item.city}
                className={`bg-luxuryDark-card border border-luxuryDark-border/60 p-6 rounded-sm hover:border-luxuryGold/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-luxuryGold/10 group cursor-pointer transform ${
                  isVisible.coverage 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-12 opacity-0'
                }`}
                style={{ 
                  transitionDelay: `${index * 100}ms`,
                  transitionProperty: 'all'
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-xl text-white font-normal mb-1 tracking-wide group-hover:text-luxuryGold transition-colors">{item.city}</h3>
                    <p className="text-xs text-gray-400">
                      <Users size={12} className="inline mr-1" />
                      {item.partners} Partners
                    </p>
                  </div>
                  <div className="text-luxuryGold group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                    <MapPin size={28} />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-luxuryDark-border/60">
                  <span className="inline-flex items-center gap-1 text-[9px] text-green-400 font-semibold uppercase tracking-wider">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-400 text-sm mb-6">
              Don't see your city? We're expanding rapidly!
            </p>
            <button
              onClick={() => navigate('/support')}
              className="px-6 py-3 text-xs font-bold tracking-widest border border-luxuryGold text-luxuryGold hover:bg-luxuryGold hover:text-black transition-all duration-300 uppercase rounded-sm"
            >
              Request Your City
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section 
        id="testimonials"
        ref={setSectionRef('testimonials')}
        className="py-24 bg-luxuryDark-base border-t border-luxuryDark-border"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs font-bold tracking-[0.3em] text-luxuryGold uppercase block mb-3">CLIENT VOICES</span>
            <h2 className="font-serif text-3xl md:text-4xl text-white font-normal tracking-wide">Clients Love Us</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.name}
                className={`bg-luxuryDark-card border border-luxuryDark-border p-8 rounded-sm hover:border-luxuryGold/20 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-luxuryGold/10 group cursor-pointer transform ${
                  isVisible.testimonials 
                    ? 'scale-100 opacity-100' 
                    : 'scale-90 opacity-0'
                }`}
                style={{ 
                  transitionDelay: `${index * 150}ms`,
                  transitionProperty: 'all'
                }}
              >
                <div className="flex items-center space-x-1 text-luxuryGold text-xs mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <p className="text-gray-300 italic text-xs leading-relaxed font-light mb-6">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center space-x-3 border-t border-luxuryDark-border/60 pt-4">
                  <div className="w-10 h-10 bg-luxuryDark-border rounded-full flex items-center justify-center font-bold text-luxuryGold text-xs">
                    {testimonial.initial}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white tracking-wide">{testimonial.name}</h4>
                    <span className="text-[9px] text-gray-500 tracking-wider">Verified {testimonial.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offer Banner */}
      <section className="py-16 bg-gradient-to-r from-luxuryGold-dark via-luxuryGold to-luxuryGold-dark border-y border-luxuryGold/40 animate-[shimmer_3s_ease-in-out_infinite]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center animate-[bounce_2s_ease-in-out_infinite]">
                <Award size={32} className="text-luxuryGold" />
              </div>
              <div>
                <h3 className="font-serif text-2xl text-black font-semibold mb-1">First Time Offer</h3>
                <p className="text-sm text-black/80 font-medium">Get 50% off on your first booking. Limited time only!</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/book')}
              className="px-8 py-4 text-xs font-bold tracking-widest bg-black hover:bg-luxuryDark-card text-luxuryGold border-2 border-black transition-all duration-300 uppercase rounded-sm whitespace-nowrap"
            >
              Claim Offer Now
            </button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 bg-[#0E0E0E] border-t border-luxuryDark-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-luxuryDark-base via-transparent to-luxuryDark-base opacity-60"></div>
        <div className="relative max-w-3xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="animate-float">
            <Sparkles size={40} className="text-luxuryGold mx-auto mb-6" />
          </div>
          <h2 className="font-serif text-3xl md:text-5xl text-white font-normal mb-4 tracking-wide">
            Ready for a <span className="italic text-luxuryGold">Spotless</span> Car?
          </h2>
          <p className="text-gray-400 mb-8 text-sm md:text-base tracking-wide font-light">
            Join thousands of satisfied customers. Book your first premium wash today.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <button
              onClick={() => navigate('/book')}
              className="px-8 py-4 text-xs font-bold tracking-[0.2em] bg-luxuryGold hover:bg-luxuryGold-light text-black transition-all duration-300 uppercase rounded-sm shadow-lg shadow-luxuryGold/10 hover:shadow-luxuryGold/20 inline-flex items-center gap-2 animate-glow hover:scale-105 transform"
            >
              <CalendarCheck size={16} />
              Book Your First Wash
            </button>
            <a
              href="tel:+919876543210"
              className="px-8 py-4 text-xs font-bold tracking-[0.2em] border border-luxuryGold text-luxuryGold hover:bg-luxuryGold hover:text-black transition-all duration-300 uppercase rounded-sm inline-flex items-center gap-2 hover:scale-105 transform"
            >
              <Phone size={16} />
              Call Us Now
            </a>
          </div>

          <div className="flex items-center justify-center gap-8 text-xs text-gray-500 flex-wrap">
            <div className="flex items-center gap-2 hover:text-luxuryGold transition-colors cursor-pointer">
              <CheckCircle size={14} className="text-luxuryGold" />
              <span>No Hidden Charges</span>
            </div>
            <div className="flex items-center gap-2 hover:text-luxuryGold transition-colors cursor-pointer">
              <CheckCircle size={14} className="text-luxuryGold" />
              <span>100% Verified Partners</span>
            </div>
            <div className="flex items-center gap-2 hover:text-luxuryGold transition-colors cursor-pointer">
              <CheckCircle size={14} className="text-luxuryGold" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Animation Keyframes */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(197, 168, 128, 0.1);
          }
          50% {
            box-shadow: 0 0 30px rgba(197, 168, 128, 0.3);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
