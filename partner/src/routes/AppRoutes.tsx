import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Login from '../pages/Auth/Login';
import Jobs from '../pages/Jobs';
import JobDetail from '../pages/Jobs/JobDetail';
import Checklist from '../pages/Checklist';
import Earnings from '../pages/Earnings';
import Profile from '../pages/Profile';
import Verification from '../pages/Verification';
import Notifications from '../pages/Notifications';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Navigate to="/jobs" replace />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/checklist" element={<Checklist />} />
        <Route path="/earnings" element={<Earnings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="/notifications" element={<Notifications />} />
      </Route>
    </Routes>
  );
}
