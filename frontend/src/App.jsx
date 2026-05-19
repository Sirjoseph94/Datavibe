import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import AdminManagement from './pages/AdminManagement';
import BundleManagement from './pages/BundleManagement';
import VerifyPayment from './pages/VerifyPayment';
import GatewayManagement from './pages/GatewayManagement';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

function App() {
  const { theme } = useContext(AuthContext);
  return (
    <BrowserRouter>
      <div className={`min-h-screen font-sans transition-colors duration-300 ${
        theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<VerifyPayment />} />
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['SUBSCRIBER']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/super-admin" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/manage-admins" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
              <AdminManagement />
            </ProtectedRoute>
          } />
          <Route path="/manage-bundles" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
              <BundleManagement />
            </ProtectedRoute>
          } />
          <Route path="/manage-gateways" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
              <GatewayManagement />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
