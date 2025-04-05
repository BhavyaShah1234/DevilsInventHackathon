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

  return (
    <>
      {/* [Popups remain unchanged here...] */}

      {/* Header with Icons */}
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Robot Dashboard</h1>
          <p className="text-gray-400 mt-2">Manage robot activity and settings</p>
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
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
