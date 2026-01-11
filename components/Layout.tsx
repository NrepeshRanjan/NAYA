import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Menu, X, Shield, BookOpen, User as UserIcon } from 'lucide-react';
import { Role } from '../types';
import Footer from './Footer';
import { Link, useLocation } from 'react-router-dom'; // Using react-router-dom which we will setup in App.tsx

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const getDashboardLink = () => {
    switch (user?.role) {
      case Role.ADMIN: return '/admin';
      case Role.TEACHER: return '/teacher';
      case Role.STUDENT: return '/student';
      default: return '/login';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              G
            </div>
            <span className="font-bold text-xl text-slate-800">Grow-up</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <Link to={getDashboardLink()} className="text-sm font-medium text-slate-600 hover:text-blue-600">
                  Dashboard
                </Link>
                <div className="h-4 w-px bg-slate-200"></div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                    {user.role}
                  </span>
                  <span className="text-sm font-medium text-slate-800 truncate max-w-[120px]">
                    {user.name}
                  </span>
                </div>
                <button 
                  onClick={logout}
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                 <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-blue-600">
                  Login
                </Link>
                <Link to="/signup" className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors">
                  Student Signup
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-slate-600"
            onClick={toggleMenu}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 p-4 absolute w-full shadow-lg">
            {user ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <UserIcon size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.role}</p>
                  </div>
                </div>
                <Link 
                  to={getDashboardLink()} 
                  className="block py-2 text-slate-700 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button 
                  onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                  className="flex items-center gap-2 py-2 text-red-600 font-medium w-full text-left"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                 <Link 
                  to="/login" 
                  className="w-full py-2.5 text-center text-slate-600 font-medium border border-slate-200 rounded"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="w-full py-2.5 text-center bg-blue-600 text-white font-medium rounded shadow-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Join as Student
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
