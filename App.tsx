import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import { Role } from './types';

// Guard Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles: Role[] }> = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading secure environment...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />; // Unauthorized redirect
  }

  return <>{children}</>;
};

// Root Redirector based on Role
const RootRedirect: React.FC = () => {
    const { user, isLoading } = useAuth();
    
    if (isLoading) return null;
    if (!user) return <Navigate to="/login" replace />;

    switch (user.role) {
        case Role.ADMIN: return <Navigate to="/admin" replace />;
        case Role.TEACHER: return <Navigate to="/teacher" replace />;
        case Role.STUDENT: return <Navigate to="/student" replace />;
        default: return <Navigate to="/login" replace />;
    }
};

const AppRoutes: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Admin Routes */}
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute allowedRoles={[Role.ADMIN]}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Teacher Routes */}
        <Route 
          path="/teacher/*" 
          element={
            <ProtectedRoute allowedRoles={[Role.TEACHER, Role.ADMIN]}>
              <TeacherDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Student Routes */}
        <Route 
          path="/student/*" 
          element={
            <ProtectedRoute allowedRoles={[Role.STUDENT]}>
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route path="/student/payment" element={
            <ProtectedRoute allowedRoles={[Role.STUDENT]}>
                <StudentDashboard /> 
            </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="/" element={<RootRedirect />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
