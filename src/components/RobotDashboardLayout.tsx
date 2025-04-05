
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Home, Box, Sliders } from 'lucide-react';

interface RobotDashboardLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  currentPage: 'information' | 'inventory' | 'control';
}

export const RobotDashboardLayout: React.FC<RobotDashboardLayoutProps> = ({
  children,
  title,
  subtitle,
  currentPage
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-950 text-white p-4 md:p-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">{title}</h1>
        <p className="text-gray-400 mt-2">{subtitle}</p>
      </header>

      {/* Navigation */}
      <nav className="mb-8 bg-black/30 backdrop-blur-lg rounded-lg border border-gray-800 overflow-hidden">
        <ul className="flex flex-wrap">
          <li className="flex-1">
            <Link 
              to="/" 
              className={`flex items-center justify-center gap-2 py-3 px-4 text-center transition-colors ${
                currentPage === 'information' 
                  ? 'bg-blue-900/50 border-b-2 border-blue-500 text-blue-400' 
                  : 'hover:bg-gray-800/50'
              }`}
            >
              <Home size={18} />
              <span className="hidden sm:inline">Information</span>
            </Link>
          </li>
          <li className="flex-1">
            <Link 
              to="/inventory" 
              className={`flex items-center justify-center gap-2 py-3 px-4 text-center transition-colors ${
                currentPage === 'inventory' 
                  ? 'bg-blue-900/50 border-b-2 border-blue-500 text-blue-400' 
                  : 'hover:bg-gray-800/50'
              }`}
            >
              <Box size={18} />
              <span className="hidden sm:inline">Inventory</span>
            </Link>
          </li>
          <li className="flex-1">
            <Link 
              to="/control" 
              className={`flex items-center justify-center gap-2 py-3 px-4 text-center transition-colors ${
                currentPage === 'control' 
                  ? 'bg-blue-900/50 border-b-2 border-blue-500 text-blue-400' 
                  : 'hover:bg-gray-800/50'
              }`}
            >
              <Sliders size={18} />
              <span className="hidden sm:inline">Control</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
};
