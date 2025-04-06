import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  role: 'user' | 'admin' | 'super-admin';
  permissions: string[];
  token: string;
  tokenExpiry: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Auto-login as admin for development
  useEffect(() => {
    const autoLogin = async () => {
      try {
        setIsLoading(true);
        // Create a default admin user
        const adminUser: User = {
          id: '1',
          email: 'admin@example.com',
          role: 'super-admin',
          permissions: ['all'],
          token: 'dev-token',
          tokenExpiry: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
        };

        // Store the admin user data
        localStorage.setItem(TOKEN_KEY, adminUser.token);
        localStorage.setItem(USER_KEY, JSON.stringify(adminUser));
        setUser(adminUser);

        // If on login page, redirect to home
        if (location.pathname === '/login') {
          navigate('/');
        }
      } catch (err) {
        console.error('Auto-login error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    autoLogin();
  }, [navigate, location.pathname]);

  const hasRole = (role: string): boolean => {
    if (!user) return false;
    if (user.role === 'super-admin') return true;
    return user.role === role;
  };

  const hasAnyRole = (roles: string[]): boolean => {
    if (!user) return false;
    if (user.role === 'super-admin') return true;
    return roles.includes(user.role);
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (user.role === 'super-admin') return true;
    return user.permissions?.includes(permission) || false;
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!user) return false;
    if (user.role === 'super-admin') return true;
    return permissions.some(permission => user.permissions?.includes(permission));
  };

  // These functions are kept for compatibility but won't be used in development
  const login = async (email: string, password: string) => {
    // Auto-login is handling authentication
    return;
  };

  const register = async (email: string, password: string, role?: string) => {
    // Auto-login is handling authentication
    return;
  };

  const logout = () => {
    // For development, just redirect to home
    navigate('/');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        register,
        logout,
        hasRole,
        hasAnyRole,
        hasPermission,
        hasAnyPermission
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 