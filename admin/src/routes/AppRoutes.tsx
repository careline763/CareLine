import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Login from '../pages/Auth/Login';
import Dashboard from '../pages/Dashboard';
import Bookings from '../pages/Bookings';
import Partners from '../pages/Partners';
import Users from '../pages/Users';
import Referrals from '../pages/Referrals';
import Subscriptions from '../pages/Subscriptions';
import Plans from '../pages/Plans';
import Coupons from '../pages/Coupons';
import Complaints from '../pages/Complaints';
// import Societies from '../pages/Societies'; // B2B — disabled, B2C only
import Pricing from '../pages/Pricing';
import ServiceAreas from '../pages/ServiceAreas';
import Analytics from '../pages/Analytics';
import Settings from '../pages/Settings';
// import Fleet from '../pages/Fleet'; // B2B — disabled, B2C only
import Notifications from '../pages/Notifications';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/users" element={<Users />} />
        <Route path="/referrals" element={<Referrals />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/coupons" element={<Coupons />} />
        <Route path="/complaints" element={<Complaints />} />
        {/* <Route path="/societies" element={<Societies />} /> */}{/* B2B — disabled, B2C only */}
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/service-areas" element={<ServiceAreas />} />
        {/* <Route path="/fleet" element={<Fleet />} /> */}{/* B2B — disabled, B2C only */}
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
