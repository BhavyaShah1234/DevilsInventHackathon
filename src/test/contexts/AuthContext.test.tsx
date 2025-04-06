import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock fetch
global.fetch = vi.fn();

const TestComponent = () => {
  const { isAuthenticated, user, error, login, logout } = useAuth();
  return (
    <div>
      <div data-testid="isAuthenticated">{isAuthenticated.toString()}</div>
      <div data-testid="user">{user ? JSON.stringify(user) : 'null'}</div>
      <div data-testid="error">{error || 'null'}</div>
      <button onClick={() => login('test@example.com', 'password123')}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
  });

  it('provides initial state', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByTestId('isAuthenticated').textContent).toBe('false');
    expect(screen.getByTestId('user').textContent).toBe('null');
    expect(screen.getByTestId('error').textContent).toBe('null');
  });

  it('handles successful login', async () => {
    const mockResponse = {
      user: {
        id: '1',
        email: 'test@example.com',
        role: 'user',
      },
      token: 'test-token',
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    const loginButton = screen.getByText('Login');
    await act(async () => {
      loginButton.click();
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith('auth_token', 'test-token');
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'user_data',
      JSON.stringify({
        id: '1',
        email: 'test@example.com',
        role: 'user',
        token: 'test-token',
        tokenExpiry: expect.any(Number),
      })
    );
  });

  it('handles failed login', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    const loginButton = screen.getByText('Login');
    await act(async () => {
      loginButton.click();
    });

    expect(screen.getByTestId('error').textContent).toBe('Invalid credentials');
  });

  it('handles logout', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    const logoutButton = screen.getByText('Logout');
    await act(async () => {
      logoutButton.click();
    });

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_token');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('user_data');
  });

  it('validates token on initialization', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      role: 'user',
      token: 'test-token',
      tokenExpiry: Date.now() + 1000 * 60 * 60, // 1 hour from now
    };

    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'auth_token') return 'test-token';
      if (key === 'user_data') return JSON.stringify(mockUser);
      return null;
    });

    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByTestId('isAuthenticated').textContent).toBe('true');
    expect(screen.getByTestId('user').textContent).toBe(JSON.stringify(mockUser));
  });

  it('handles expired token on initialization', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      role: 'user',
      token: 'test-token',
      tokenExpiry: Date.now() - 1000 * 60 * 60, // 1 hour ago
    };

    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'auth_token') return 'test-token';
      if (key === 'user_data') return JSON.stringify(mockUser);
      return null;
    });

    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_token');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('user_data');
    expect(screen.getByTestId('isAuthenticated').textContent).toBe('false');
  });
}); 