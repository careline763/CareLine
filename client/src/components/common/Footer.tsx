import { Car } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-luxuryDark-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex flex-col items-start mb-6">
              <span className="font-serif text-2xl tracking-widest text-luxuryGold font-semibold flex items-center gap-2">
                <Car size={18} className="text-luxuryGold/80" />
                CARELINE
              </span>
              <span className="text-[8px] tracking-[0.4em] text-gray-400 font-semibold uppercase mt-0.5">P R E M I U M &nbsp; C A R E</span>
            </div>
            <p className="text-gray-400 text-xs font-light tracking-wide leading-relaxed">Professional doorstep car cleaning services. Daily, weekly, or monthly plans to keep your car spotless with luxury-grade attention to detail.</p>
          </div>

          <div>
            <h4 className="text-[10px] tracking-widest text-luxuryGold font-bold uppercase mb-4">Quick Links</h4>
            <ul className="space-y-2 text-xs text-gray-400 tracking-wider">
              {[['/', 'Home'], ['/plans', 'Plans'], ['/services', 'Services'], ['/support', 'Support']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] tracking-widest text-luxuryGold font-bold uppercase mb-4">Contact</h4>
            <ul className="space-y-2 text-xs text-gray-400 tracking-wider">
              <li>support@careline.in</li>
              <li>+91 98765 43210</li>
              <li>Mon–Sun, 7 AM – 9 PM</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-luxuryDark-border/60 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-500 tracking-wider">
          <p>&copy; {new Date().getFullYear()} CareLine. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
