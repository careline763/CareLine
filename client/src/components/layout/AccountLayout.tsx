import type { ReactNode } from 'react';
import AccountSidebar from './AccountSidebar';

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10 grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 items-start">
      <AccountSidebar />
      <div className="lg:col-span-3 min-w-0">{children}</div>
    </div>
  );
}
