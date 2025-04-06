import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

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

  const validateToken = (token: string, expiry: number): boolean => {
    return token && expiry > Date.now();
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
          if (validateToken(storedToken, userData.tokenExpiry)) {
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

      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      const userData: User = {
        id: data.user.id,
        email: data.user.email,
        role: data.user.role,
        token: data.token,
        tokenExpiry: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      };

      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      setUser(userData);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      let data;
      try {
        data = await response.json();
      } catch (err) {
        console.error('JSON parse error:', err);
        throw new Error('Invalid response from server');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      const { token, user } = data;

      if (!token || !user) {
        throw new Error('Invalid response format');
      }

      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify({
        ...user,
        token,
        tokenExpiry: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      }));

      setUser({
        ...user,
        token,
        tokenExpiry: Date.now() + 24 * 60 * 60 * 1000,
      });
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      throw err;
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