import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';

// Mock the useAuth hook
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('Navbar', () => {
  const mockLogin = vi.fn();
  const mockLogout = vi.fn();

  beforeEach(() => {
    // Reset all mocks before each test
    vi.resetAllMocks();
    
    // Set up default mock implementation
    (useAuth as any).mockImplementation(() => ({
      isAuthenticated: false,
      user: null,
      login: mockLogin,
      logout: mockLogout,
      isLoading: false,
      error: null,
    }));
  });

  it('renders navigation links', () => {
    render(<Navbar />);
    
    expect(screen.getByText('Information')).toBeInTheDocument();
    expect(screen.getByText('Inventory')).toBeInTheDocument();
    expect(screen.getByText('Control')).toBeInTheDocument();
    expect(screen.getByText('Inspections')).toBeInTheDocument();
  });

  it('shows login button when not authenticated', () => {
    render(<Navbar />);
    
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });

  it('shows logout button when authenticated', () => {
    (useAuth as any).mockImplementation(() => ({
      isAuthenticated: true,
      user: { id: '1', email: 'test@example.com', role: 'user' },
      login: mockLogin,
      logout: mockLogout,
      isLoading: false,
      error: null,
    }));

    render(<Navbar />);
    
    expect(screen.getByText('Logout')).toBeInTheDocument();
    expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
  });

  it('opens login modal when sign in button is clicked', () => {
    render(<Navbar />);
    
    const signInButton = screen.getByText('Sign In');
    fireEvent.click(signInButton);
    
    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
  });

  it('calls login function with correct credentials', async () => {
    render(<Navbar />);
    
    const signInButton = screen.getByText('Sign In');
    fireEvent.click(signInButton);
    
    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');
    const loginButton = screen.getByText('Login');
    
    fireEvent.change(usernameInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('toggles dark mode when dark mode button is clicked', () => {
    render(<Navbar />);
    
    const darkModeButton = screen.getByLabelText('Switch to dark mode');
    fireEvent.click(darkModeButton);
    
    expect(document.body.classList.contains('dark')).toBe(true);
  });

  it('shows notifications panel when notifications button is clicked', () => {
    render(<Navbar />);
    
    const notificationsButton = screen.getByLabelText('Notifications');
    fireEvent.click(notificationsButton);
    
    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });
}); 