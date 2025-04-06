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
  login: (email: string, password: string, role: string, rememberMe?: boolean) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';
const REMEMBER_ME_KEY = 'remember_me';

// Session timeout in milliseconds (24 hours)
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000;

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
    localStorage.removeItem(REMEMBER_ME_KEY);
    setUser(null);
  };

  const checkSessionTimeout = (userData: User): boolean => {
    if (!userData.tokenExpiry) return false;
    return Date.now() < userData.tokenExpiry;
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem(TOKEN_KEY);
        const storedUser = localStorage.getItem(USER_KEY);
        const rememberMe = localStorage.getItem(REMEMBER_ME_KEY) === 'true';

        if (storedToken && storedUser) {
          const userData = JSON.parse(storedUser);
          const isValid = await validateToken(storedToken);
          const isSessionValid = rememberMe || checkSessionTimeout(userData);
          
          if (isValid && isSessionValid) {
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

  const login = async (email: string, password: string, role: string, rememberMe: boolean = false) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { token, user: userData } = await api.auth.login(email, password, role);
      
      // Calculate token expiry based on remember me preference
      const tokenExpiry = rememberMe ? Date.now() + SESSION_TIMEOUT : Date.now() + (12 * 60 * 60 * 1000); // 12 hours if not remembered
      
      const user: User = {
        ...userData,
        token,
        tokenExpiry
      };
      
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      localStorage.setItem(REMEMBER_ME_KEY, rememberMe.toString());
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
      
      const tokenExpiry = Date.now() + SESSION_TIMEOUT;
      
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 