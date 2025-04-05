import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, User, Settings, Home, Box, Sliders, Moon, Sun, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [showLogin, setShowLogin] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [viewArchived, setViewArchived] = useState(false);
  const [notifications, setNotifications] = useState([
    { message: 'Maintenance check due next week', time: '10:24 AM', date: '2025-04-05', archived: false },
    { message: 'Battery Pack running low', time: '9:12 AM', date: '2025-04-04', archived: false },
    { message: 'System firmware updated', time: '5:45 PM', date: '2025-04-03', archived: false }
  ]);

  const toggleLogin = () => setShowLogin(!showLogin);
  const toggleNotifications = () => setShowNotifications(!showNotifications);
  const toggleSettings = () => setShowSettings(!showSettings);
  const toggleDarkMode = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    localStorage.setItem('darkMode', newValue.toString());
  };

  const archiveNotification = (index: number) => {
    const updated = [...notifications];
    updated[index].archived = true;
    setNotifications(updated);
  };

  const restoreNotification = (index: number) => {
    const updated = [...notifications];
    updated[index].archived = false;
    setNotifications(updated);
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
      {/* Header */}
      <header className="mb-8 flex justify-between items-center">
        <div className="flex flex-col items-start">
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            {getPageTitle(location.pathname)}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{getPageSubtitle(location.pathname)}</p>
        </div>
        <div className="flex items-center gap-4">
        <img src="/logo.png" alt="Logo" className="h-20 w-auto mr-400" />

          <div className="flex gap-3 items-center">
            <button onClick={toggleNotifications} className="flex items-center gap-2 px-3 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white">
              <Bell size={16} />
            </button>
            <button onClick={toggleDarkMode} className="flex items-center gap-2 px-3 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white">
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button onClick={toggleLogin} className="flex items-center gap-2 px-3 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white">
              <User size={16} /> <span className="text-sm">Sign In</span>
            </button>
            <button onClick={toggleSettings} className="flex items-center gap-2 px-3 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white">
              <Settings size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="mb-8 bg-white/50 dark:bg-black/30 backdrop-blur-lg rounded-lg border overflow-hidden">
        <ul className="flex flex-wrap">
          <li className="flex-1">
            <Link to="/" className={getNavClass('/')}> 
              <Home size={18} />
              <span className="hidden sm:inline">Information</span>
            </Link>
          </li>
          <li className="flex-1">
            <Link to="/inventory" className={getNavClass('/inventory')}>
              <Box size={18} />
              <span className="hidden sm:inline">Inventory</span>
            </Link>
          </li>
          <li className="flex-1">
            <Link to="/control" className={getNavClass('/control')}>
              <Sliders size={18} />
              <span className="hidden sm:inline">Control</span>
            </Link>
          </li>
          <li className="flex-1">
            <Link to="/inspections" className={getNavClass('/inspections')}>
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
