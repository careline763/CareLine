import { Routes, Route } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import AccountLayout from '../components/layout/AccountLayout';
import ProtectedRoute from './ProtectedRoute';

import Home from '../pages/Home';
import Login from '../pages/Auth/Login';
import OTPVerify from '../pages/Auth/OTPVerify';
import Services from '../pages/Services';
import Plans from '../pages/Plans';
import Booking from '../pages/Booking';
import BookingList from '../pages/Booking/BookingList';
import Tracking from '../pages/Tracking';
import SubscriptionManage from '../pages/SubscriptionManage';
import Reviews from '../pages/Reviews';
import Support from '../pages/Support';
import Profile from '../pages/Profile';
import Complaints from '../pages/Complaints';
import NewComplaint from '../pages/Complaints/NewComplaint';
import Notifications from '../pages/Notifications';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function Account({ children }: { children: React.ReactNode }) {
  return (
    <Layout>
      <AccountLayout>{children}</AccountLayout>
    </Layout>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/verify-otp" element={<OTPVerify />} />

      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/services" element={<Layout><Services /></Layout>} />
      <Route path="/plans" element={<Layout><Plans /></Layout>} />
      <Route path="/support" element={<Layout><Support /></Layout>} />

      <Route element={<ProtectedRoute />}>
        <Route path="/book" element={<Layout><Booking /></Layout>} />
        <Route path="/bookings" element={<Account><BookingList /></Account>} />
        <Route path="/track/:id" element={<Account><Tracking /></Account>} />
        <Route path="/subscriptions" element={<Account><SubscriptionManage /></Account>} />
        <Route path="/reviews/:bookingId" element={<Layout><Reviews /></Layout>} />
        <Route path="/profile" element={<Account><Profile /></Account>} />
        <Route path="/complaints" element={<Account><Complaints /></Account>} />
        <Route path="/complaints/new" element={<Account><NewComplaint /></Account>} />
        <Route path="/notifications" element={<Account><Notifications /></Account>} />
      </Route>
    </Routes>
  );
}
