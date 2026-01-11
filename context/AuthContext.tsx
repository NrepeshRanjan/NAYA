import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';
import { db } from '../services/db';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: Partial<User>) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage for session
    const storedUserId = localStorage.getItem('growup_session_user_id');
    if (storedUserId) {
      const foundUser = db.users.getById(storedUserId);
      if (foundUser) {
        setUser(foundUser);
      } else {
        localStorage.removeItem('growup_session_user_id');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const foundUser = db.users.findByEmail(email);
    if (foundUser && foundUser.passwordHash === password) {
      setUser(foundUser);
      localStorage.setItem('growup_session_user_id', foundUser.id);
    } else {
      setIsLoading(false);
      throw new Error('Invalid credentials');
    }
    setIsLoading(false);
  };

  const signup = async (userData: Partial<User>) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: userData.name || 'New User',
        email: userData.email!,
        mobile: userData.mobile!,
        passwordHash: userData.passwordHash!,
        role: Role.STUDENT, // Default signup is always student
        createdAt: Date.now(),
        // Fix: isBlocked is required by User interface
        isBlocked: false,
        classGrade: userData.classGrade,
        subscriptionType: userData.subscriptionType,
        isPaid: false, // Must pay after signup
      };
      
      const created = db.users.create(newUser);
      setUser(created);
      localStorage.setItem('growup_session_user_id', created.id);
    } catch (e: any) {
      setIsLoading(false);
      throw e;
    }
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('growup_session_user_id');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};