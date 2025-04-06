import { Notification } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

interface FetchOptions extends RequestInit {
  retries?: number;
}

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

// Add auth token to headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

async function fetchWithRetry(url: string, options: FetchOptions = {}, retries = MAX_RETRIES): Promise<Response> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...options.headers,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Clear auth data on unauthorized access
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        throw new Error('Unauthorized access. Please login again.');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying request (${retries} attempts remaining)...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
}

export const api = {
  auth: {
    async login(email: string, password: string, role: string): Promise<{ token: string; user: any }> {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
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
        return data;
      } catch (error) {
        console.error('Login failed:', error);
        throw new Error(error instanceof Error ? error.message : 'Login failed. Please try again.');
      }
    },

    async register(email: string, password: string): Promise<{ token: string; user: any }> {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          throw new Error('Registration failed');
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Registration failed:', error);
        throw new Error(error instanceof Error ? error.message : 'Registration failed. Please try again.');
      }
    },

    async validateToken(token: string): Promise<boolean> {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/validate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        return response.ok;
      } catch (error) {
        console.error('Token validation failed:', error);
        return false;
      }
    },
  },

  notifications: {
    async getAll(): Promise<Notification[]> {
      try {
        const response = await fetchWithRetry(`${API_BASE_URL}/api/notifications`);
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to fetch notifications. Please try again later.');
      }
    },

    async archive(id: string): Promise<void> {
      try {
        await fetchWithRetry(`${API_BASE_URL}/api/notifications/${id}/archive`, {
          method: 'POST',
        });
      } catch (error) {
        console.error('Failed to archive notification:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to archive notification. Please try again later.');
      }
    },

    async restore(id: string): Promise<void> {
      try {
        await fetchWithRetry(`${API_BASE_URL}/api/notifications/${id}/restore`, {
          method: 'POST',
        });
      } catch (error) {
        console.error('Failed to restore notification:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to restore notification. Please try again later.');
      }
    },
  },
}; 