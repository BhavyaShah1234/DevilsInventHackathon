import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../services/api';

interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
  token: string;
  tokenExpiry: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string, role: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
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

  const validateToken = async (token: string): Promise<boolean> => {
    try {
      return await api.auth.validateToken(token);
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  };

  const clearAuthData = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem(TOKEN_KEY);
        const storedUser = localStorage.getItem(USER_KEY);

        if (storedToken && storedUser) {
          const userData = JSON.parse(storedUser);
          const isValid = await validateToken(storedToken);
          
          if (isValid) {
            setUser(userData);
            if (location.pathname === '/login' || location.pathname === '/register') {
              navigate('/');
            }
          } else {
            clearAuthData();
            if (location.pathname !== '/register') {
              navigate('/login');
            }
          }
        } else if (location.pathname !== '/login' && location.pathname !== '/register') {
          navigate('/login');
        }
      } catch (err) {
        clearAuthData();
        if (location.pathname !== '/register') {
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [navigate, location.pathname]);

  const login = async (email: string, password: string, role: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { token, user: userData } = await api.auth.login(email, password, role);
      
      // Calculate token expiry (24 hours from now)
      const tokenExpiry = Date.now() + 24 * 60 * 60 * 1000;
      
      const user: User = {
        ...userData,
        token,
        tokenExpiry
      };
      
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      setUser(user);
      
      if (location.pathname === '/login' || location.pathname === '/register') {
        navigate('/');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { token, user: userData } = await api.auth.register(email, password);
      
      // Calculate token expiry (24 hours from now)
      const tokenExpiry = Date.now() + 24 * 60 * 60 * 1000;
      
      const user: User = {
        ...userData,
        token,
        tokenExpiry
      };
      
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      setUser(user);
      
      navigate('/');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Registration failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearAuthData();
    navigate('/login');
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 