import React from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, Settings, CreditCard, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Sub-modules
import Overview from './dashboard/Overview';
import UserManagement from './dashboard/UserManagement';
import ContentManagement from './dashboard/ContentManagement';
import SubscriptionManagement from './dashboard/SubscriptionManagement';
import SystemSettings from './dashboard/SystemSettings';

const AdminDashboard: React.FC = () => {
  const { logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/admin' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: BookOpen, label: 'Content', path: '/admin/content' },
    { icon: CreditCard, label: 'Subscriptions', path: '/admin/plans' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  const isActive = (path: string) => {
      if (path === '/admin' && location.pathname === '/admin') return true;
      if (path !== '/admin' && location.pathname.startsWith(path)) return true;
      return false;
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)] gap-6">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white rounded-xl shadow-sm border border-slate-100 flex-shrink-0 h-fit sticky top-20">
        <div className="p-4 border-b border-slate-50">
           <h2 className="font-bold text-slate-800">Admin Console</h2>
           <p className="text-xs text-slate-400">Full System Control</p>
        </div>
        <nav className="p-2 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
          <button 
             onClick={logout}
             className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 mt-4"
          >
              <LogOut size={18} />
              Sign Out
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/content" element={<ContentManagement />} />
          <Route path="/plans" element={<SubscriptionManagement />} />
          <Route path="/settings" element={<SystemSettings />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
