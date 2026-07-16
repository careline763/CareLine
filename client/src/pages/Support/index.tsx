import { useState } from 'react';
import { MessageCircle, Phone, Mail, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

const FAQS = [
  { q: 'How long does a car wash take?', a: 'A standard exterior wash takes 20–30 minutes. Interior cleaning adds another 15–20 minutes.' },
  { q: 'What if I want to reschedule or cancel?', a: 'You can reschedule up to 2 hours before the booking time. Cancellations made within 1 hour may incur a small fee.' },
  { q: 'Is waterless wash effective?', a: 'Yes! Our eco-friendly waterless formula is specially designed to lift dirt and leave a streak-free finish without a single drop of water.' },
  { q: 'How are partners verified?', a: 'All partners go through document verification, background checks, and a training session before being approved on the platform.' },
  { q: 'What if I\'m not satisfied with the service?', a: 'If you\'re unsatisfied, contact us within 24 hours of the booking. We\'ll arrange a free re-wash or issue a credit.' },
  { q: 'Can I pause my subscription?', a: 'Yes, you can pause your subscription any time from the Subscriptions page. Unused credits carry forward.' },
];

export default function Support() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.message) return toast.error('Please fill in required fields');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success('Message sent! We\'ll get back to you within 24 hours.');
    setForm({ name: '', email: '', message: '' });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-luxuryDark-base py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-bold tracking-[0.3em] text-luxuryGold uppercase block mb-3">CUSTOMER SUPPORT</span>
          <h1 className="font-serif text-4xl md:text-5xl text-white font-normal tracking-wide mb-4">Help & Support</h1>
          <div className="h-0.5 w-16 bg-luxuryGold mx-auto mb-6"></div>
          <p className="text-gray-400 text-sm md:text-base font-light tracking-wide">
            We're here 7 days a week, 7 AM – 9 PM.
          </p>
        </div>

        {/* Contact Options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          {[
            { icon: Phone, label: 'Call Us', value: '+91 98765 43210', href: 'tel:+919876543210', iconColor: 'text-luxuryGold' },
            { icon: MessageCircle, label: 'WhatsApp', value: 'Chat on WhatsApp', href: '#', iconColor: 'text-luxuryGold' },
            { icon: Mail, label: 'Email', value: 'support@careline.in', href: 'mailto:support@careline.in', iconColor: 'text-luxuryGold' },
          ].map(({ icon: Icon, label, value, href, iconColor }) => (
            <a 
              key={label} 
              href={href} 
              className="flex items-center gap-4 p-6 bg-luxuryDark-card border border-luxuryDark-border/60 rounded-sm hover:border-luxuryGold/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-luxuryGold/10 group"
            >
              <div className="w-12 h-12 rounded-sm bg-luxuryDark-input border border-luxuryDark-border flex items-center justify-center group-hover:border-luxuryGold/40 transition-colors">
                <Icon size={22} className={iconColor} />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">{label}</p>
                <p className="text-sm font-medium text-white group-hover:text-luxuryGold transition-colors">{value}</p>
              </div>
            </a>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* FAQs */}
          <div>
            <h2 className="font-serif text-2xl text-white font-normal mb-6 tracking-wide">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {FAQS.map((faq, i) => (
                <div 
                  key={i} 
                  className="bg-luxuryDark-card border border-luxuryDark-border/60 rounded-sm overflow-hidden hover:border-luxuryGold/40 transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left group"
                  >
                    <span className="text-sm font-medium text-white pr-4 group-hover:text-luxuryGold transition-colors">{faq.q}</span>
                    <ChevronDown 
                      size={18} 
                      className={`text-gray-500 group-hover:text-luxuryGold transition-all duration-300 flex-shrink-0 ${openFaq === i ? 'rotate-180' : ''}`} 
                    />
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-6 text-sm text-gray-400 leading-relaxed border-t border-luxuryDark-border/60 bg-luxuryDark-input/30">
                      <p className="pt-4">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="font-serif text-2xl text-white font-normal mb-6 tracking-wide">Send Us a Message</h2>
            <form 
              onSubmit={handleSubmit} 
              className="bg-luxuryDark-card border border-luxuryDark-border/60 rounded-sm p-8 space-y-6 hover:border-luxuryGold/40 transition-all duration-300"
            >
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wider">
                  Name <span className="text-luxuryGold">*</span>
                </label>
                <input
                  value={form.name} 
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 bg-luxuryDark-input border border-luxuryDark-border text-white text-sm rounded-sm focus:outline-none focus:ring-2 focus:ring-luxuryGold focus:border-luxuryGold transition-all"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email" 
                  value={form.email} 
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 bg-luxuryDark-input border border-luxuryDark-border text-white text-sm rounded-sm focus:outline-none focus:ring-2 focus:ring-luxuryGold focus:border-luxuryGold transition-all"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wider">
                  Message <span className="text-luxuryGold">*</span>
                </label>
                <textarea
                  rows={5} 
                  value={form.message} 
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 bg-luxuryDark-input border border-luxuryDark-border text-white text-sm rounded-sm focus:outline-none focus:ring-2 focus:ring-luxuryGold focus:border-luxuryGold resize-none transition-all"
                  placeholder="Describe your issue or question..."
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 text-sm font-bold tracking-[0.2em] uppercase rounded-md transition-all duration-300 bg-transparent border-2 border-luxuryGold text-luxuryGold hover:bg-luxuryGold hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'SENDING...' : 'SEND MESSAGE'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
