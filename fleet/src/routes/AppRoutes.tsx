import type { ReactNode } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Login from '../pages/Auth/Login';
import Dashboard from '../pages/Dashboard';
import Vehicles from '../pages/Vehicles';
import Bookings from '../pages/Bookings';
import Invoices from '../pages/Invoices';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { token } = useAuthStore();
  return token ? <>{children}</> : <Navigate to="/login" replace/>;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route path="/" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
      <Route path="/vehicles" element={<ProtectedRoute><Vehicles/></ProtectedRoute>}/>
      <Route path="/bookings" element={<ProtectedRoute><Bookings/></ProtectedRoute>}/>
      <Route path="/invoices" element={<ProtectedRoute><Invoices/></ProtectedRoute>}/>
    </Routes>
  );
}
