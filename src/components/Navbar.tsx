import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, User, Settings, Home, Box, Sliders } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [showLogin, setShowLogin] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

  const toggleLogin = () => setShowLogin(!showLogin);
  const toggleNotifications = () => setShowNotifications(!showNotifications);
  const toggleSettings = () => setShowSettings(!showSettings);
  const toggleDarkMode = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    localStorage.setItem('darkMode', newValue.toString());
  };

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const getNavClass = (path: string) => {
    const isActive = location.pathname === path;
    return `flex items-center justify-center gap-2 py-3 px-4 text-center transition-colors ${
      isActive
        ? 'bg-blue-900/50 border-b-2 border-blue-500 text-blue-400'
        : 'hover:bg-gray-800/50 text-gray-300'
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
        return 'Inspection Logs';
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
        return 'Recent and scheduled inspection records';
      default:
        return 'Manage robot activity and settings';
    }
  };

  return (
    <>
      {/* Popups */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-4">Sign In</h2>
            <input type="text" placeholder="Username" className="w-full mb-3 px-3 py-2 rounded bg-gray-700 text-white border border-gray-600" />
            <input type="password" placeholder="Password" className="w-full mb-4 px-3 py-2 rounded bg-gray-700 text-white border border-gray-600" />
            <div className="flex justify-between">
              <button className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded">Login</button>
              <button onClick={toggleLogin} className="text-sm text-gray-400 hover:underline">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showNotifications && (
        <div className="absolute top-20 right-6 z-50 bg-gray-800 border border-gray-700 rounded-lg p-4 w-72 shadow-xl">
          <h2 className="text-md font-semibold text-white mb-2">Notifications</h2>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>🔧 Maintenance check due next week</li>
            <li>⚠️ Battery Pack running low</li>
            <li>✅ System firmware updated</li>
          </ul>
        </div>
      )}

      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Settings</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>🌗 Dark Mode</span>
                <button onClick={toggleDarkMode} className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600">{darkMode ? 'On' : 'Off'}</button>
              </div>
              <div className="flex justify-between items-center">
                <span>👤 Account Settings</span>
                <button className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600">Edit</button>
              </div>
              <div className="flex justify-between items-center">
                <span>🔐 Staff Login Details</span>
                <button className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600">View</button>
              </div>
              <div className="text-right">
                <button onClick={toggleSettings} className="text-sm text-gray-400 hover:underline">Close</button>
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
          <p className="text-gray-400 mt-2">{getPageSubtitle(location.pathname)}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={toggleNotifications} className="flex items-center gap-2 px-3 py-2 border rounded hover:bg-gray-700">
            <Bell size={16} />
          </button>
          <button onClick={toggleLogin} className="flex items-center gap-2 px-3 py-2 border rounded hover:bg-gray-700">
            <User size={16} /> <span className="text-sm">Sign In</span>
          </button>
          <button onClick={toggleSettings} className="flex items-center gap-2 px-3 py-2 border rounded hover:bg-gray-700">
            <Settings size={16} />
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="mb-8 bg-black/30 backdrop-blur-lg rounded-lg border overflow-hidden">
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
