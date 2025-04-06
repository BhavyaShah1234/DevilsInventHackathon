import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, User, Settings, Home, Box, Sliders, Moon, Sun, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface Notification {
  id: string;
  message: string;
  time: string;
  date: string;
  archived: boolean;
}

interface LoginForm {
  email: string;
  password: string;
}

interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
}

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, login, logout, register } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [viewArchived, setViewArchived] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: "",
    password: "",
  });
  const [registerForm, setRegisterForm] = useState<RegisterForm>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    // Fetch notifications from API
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        // TODO: Replace with actual API call
        const response = await fetch('/api/notifications');
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      await login(loginForm.email, loginForm.password, 'user');
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      alert("Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !registerForm.email ||
      !registerForm.password ||
      !registerForm.confirmPassword
    ) {
      alert("Please fill in all fields");
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setIsLoading(true);
      await register(registerForm.email, registerForm.password);
      navigate("/");
    } catch (error) {
      console.error("Registration error:", error);
      alert("Failed to register");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleLogin = () => setShowLogin(!showLogin);
  const toggleNotifications = () => setShowNotifications(!showNotifications);
  const toggleSettings = () => setShowSettings(!showSettings);
  const toggleDarkMode = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    localStorage.setItem('darkMode', newValue.toString());
  };

  const archiveNotification = async (id: string) => {
    try {
      // TODO: Replace with actual API call
      await fetch(`/api/notifications/${id}/archive`, { method: 'POST' });
      setNotifications(prev => prev.map(n => 
        n.id === id ? { ...n, archived: true } : n
      ));
    } catch (error) {
      console.error('Failed to archive notification:', error);
    }
  };

  const restoreNotification = async (id: string) => {
    try {
      // TODO: Replace with actual API call
      await fetch(`/api/notifications/${id}/restore`, { method: 'POST' });
      setNotifications(prev => prev.map(n => 
        n.id === id ? { ...n, archived: false } : n
      ));
    } catch (error) {
      console.error('Failed to restore notification:', error);
    }
  };

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const getNavClass = (path: string) => {
    const isActive = location.pathname === path;
    return `flex items-center justify-center gap-2 py-3 px-4 text-center transition-colors ${
      isActive
        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400 border-b-2 border-blue-500'
        : 'hover:bg-gray-200 text-gray-600 dark:hover:bg-gray-800/50 dark:text-gray-300'
    }`;
  };

  const getPageTitle = (path: string): string => {
    switch (path) {
      case '/':
        return 'Robot Information';
      case '/inventory':
        return 'Inventory Page';
      case '/control':
        return 'Control Center';
      case '/inspections':
        return 'Inspection Reports';
      default:
        return 'Robot Dashboard';
    }
  };

  const getPageSubtitle = (path: string): string => {
    switch (path) {
      case '/':
        return 'System status and specifications';
      case '/inventory':
        return 'Manage and track components';
      case '/control':
        return 'Manage operations';
      case '/inspections':
        return 'View and manage inspection reports';
      default:
        return 'Manage robot activity and settings';
    }
  };

  return (
    <>
      {showLogin && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="login-title"
        >
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-80 text-black dark:text-white">
            <h2 id="login-title" className="text-lg font-semibold mb-4">Sign In</h2>
            <form onSubmit={handleLogin}>
              <Input
                type="email"
                placeholder="Email"
                value={loginForm.email}
                onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                className="w-full mb-3 px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600"
                required
                aria-label="Email"
              />
              <Input
                type="password"
                placeholder="Password"
                value={loginForm.password}
                onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                className="w-full mb-4 px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600"
                required
                aria-label="Password"
              />
              <div className="flex justify-between">
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
                <button
                  type="button"
                  onClick={toggleLogin}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:underline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showNotifications && (
        <div
          className="fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-800 shadow-lg border-l border-gray-200 dark:border-gray-700 z-50 p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="notifications-title"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 id="notifications-title" className="text-lg font-semibold">Notifications</h2>
            <button
              onClick={toggleNotifications}
              className="hover:opacity-70"
              aria-label="Close notifications"
            >
              <X size={18} />
            </button>
          </div>
          <button
            onClick={() => setViewArchived(!viewArchived)}
            className="mb-4 text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            {viewArchived ? 'View Active' : 'View Archived'}
          </button>

          {isLoading ? (
            <div className="text-center py-4">Loading notifications...</div>
          ) : (
            <>
              {notifications
                .filter(n => n.archived === viewArchived)
                .map((n) => (
                  <div
                    key={n.id}
                    className="mb-4 p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm text-black dark:text-white shadow"
                  >
                    <p className="font-medium mb-1">{n.message}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{n.date} at {n.time}</p>
                    <div className="mt-2 text-right">
                      {viewArchived ? (
                        <button
                          onClick={() => restoreNotification(n.id)}
                          className="text-blue-600 dark:text-blue-400 text-xs hover:underline"
                        >
                          Restore
                        </button>
                      ) : (
                        <button
                          onClick={() => archiveNotification(n.id)}
                          className="text-gray-600 dark:text-gray-300 text-xs hover:underline"
                        >
                          Archive
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              {notifications.filter(n => n.archived === viewArchived).length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No {viewArchived ? 'archived' : 'active'} notifications.
                </p>
              )}
            </>
          )}
        </div>
      )}

      {showSettings && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="settings-title"
        >
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96 text-black dark:text-white">
            <h2 id="settings-title" className="text-lg font-semibold mb-4">Settings</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>👤 Account Settings</span>
                <button className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                  Edit
                </button>
              </div>
              <div className="flex justify-between items-center">
                <span>🔐 Staff Login Details</span>
                <button className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                  View
                </button>
              </div>
              <div className="text-right">
                <button
                  onClick={toggleSettings}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:underline"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            {getPageTitle(location.pathname)}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {getPageSubtitle(location.pathname)}
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <button
            onClick={toggleNotifications}
            className="flex items-center gap-2 px-3 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white"
            aria-label="Notifications"
          >
            <Bell size={16} />
          </button>
          <button
            onClick={toggleDarkMode}
            className="flex items-center gap-2 px-3 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white"
              disabled={isLoading}
            >
              <User size={16} /> <span className="text-sm">Logout</span>
            </button>
          ) : (
            <Card className="p-4">
              <Tabs defaultValue="login">
                <TabsList>
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <Input
                      type="email"
                      placeholder="Email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full mb-3 px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600"
                      required
                      aria-label="Email"
                    />
                    <Input
                      type="password"
                      placeholder="Password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                    />
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Loading..." : "Login"}
                    </Button>
                  </form>
                </TabsContent>
                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <Input
                      type="email"
                      placeholder="Email"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full mb-3 px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600"
                      required
                      aria-label="Email"
                    />
                    <Input
                      type="password"
                      placeholder="Password"
                      value={registerForm.password}
                      onChange={(e) =>
                        setRegisterForm({
                          ...registerForm,
                          password: e.target.value,
                        })
                      }
                    />
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      value={registerForm.confirmPassword}
                      onChange={(e) =>
                        setRegisterForm({
                          ...registerForm,
                          confirmPassword: e.target.value,
                        })
                      }
                    />
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Loading..." : "Register"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </Card>
          )}
          <button
            onClick={toggleSettings}
            className="flex items-center gap-2 px-3 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white"
            aria-label="Settings"
          >
            <Settings size={16} />
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="mb-8 bg-white/50 dark:bg-black/30 backdrop-blur-lg rounded-lg border overflow-hidden">
        <ul className="flex flex-wrap">
          <li className="flex-1">
            <Link to="/" className={getNavClass('/')} aria-current={location.pathname === '/' ? 'page' : undefined}>
              <Home size={18} />
              <span className="hidden sm:inline">Information</span>
            </Link>
          </li>
          <li className="flex-1">
            <Link to="/inventory" className={getNavClass('/inventory')} aria-current={location.pathname === '/inventory' ? 'page' : undefined}>
              <Box size={18} />
              <span className="hidden sm:inline">Inventory</span>
            </Link>
          </li>
          <li className="flex-1">
            <Link to="/control" className={getNavClass('/control')} aria-current={location.pathname === '/control' ? 'page' : undefined}>
              <Sliders size={18} />
              <span className="hidden sm:inline">Control</span>
            </Link>
          </li>
          <li className="flex-1">
            <Link to="/inspections" className={getNavClass('/inspections')} aria-current={location.pathname === '/inspections' ? 'page' : undefined}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
              </svg>
              <span className="hidden sm:inline">Inspections</span>
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;