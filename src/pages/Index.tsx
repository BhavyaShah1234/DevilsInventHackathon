import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Home, Sliders } from 'lucide-react';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-950 text-white p-4 md:p-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Robot Information</h1>
        <p className="text-gray-400 mt-2">System status and specifications</p>
      </header>

      {/* Navigation */}
      <nav className="mb-8 bg-black/30 backdrop-blur-lg rounded-lg border border-gray-800 overflow-hidden">
        <ul className="flex flex-wrap">
          <li className="flex-1">
            <Link 
              to="/" 
              className="flex items-center justify-center gap-2 py-3 px-4 text-center transition-colors bg-blue-900/50 border-b-2 border-blue-500 text-blue-400"
            >
              <Home size={18} />
              <span className="hidden sm:inline">Information</span>
            </Link>
          </li>
          <li className="flex-1">
            <Link 
              to="/inventory" 
              className="flex items-center justify-center gap-2 py-3 px-4 text-center transition-colors hover:bg-gray-800/50"
            >
              <Box size={18} />
              <span className="hidden sm:inline">Inventory</span>
            </Link>
          </li>
          <li className="flex-1">
            <Link 
              to="/control" 
              className="flex items-center justify-center gap-2 py-3 px-4 text-center transition-colors hover:bg-gray-800/50"
            >
              <Sliders size={18} />
              <span className="hidden sm:inline">Control</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <main>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Robot Specifications</h2>
            <div className="space-y-3">
              <div>
                <h3 className="text-md font-medium text-blue-400">Model</h3>
                <p className="text-sm text-gray-300">RBT-X3000 Explorer</p>
              </div>
              <div>
                <h3 className="text-md font-medium text-blue-400">Manufacturer</h3>
                <p className="text-sm text-gray-300">TechDynamics Industries</p>
              </div>
              <div>
                <h3 className="text-md font-medium text-blue-400">Serial Number</h3>
                <p className="text-sm text-gray-300">TD-RBT-2025-00487</p>
              </div>
              <div>
                <h3 className="text-md font-medium text-blue-400">Firmware Version</h3>
                <p className="text-sm text-gray-300">v3.5.2 (Released: 2025-03-15)</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">System Status</h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Battery Level</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-700 h-3 rounded-full overflow-hidden mr-2">
                    <div className="bg-green-500 h-full" style={{ width: '76%' }}></div>
                  </div>
                  <span className="text-sm text-gray-300">76%</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">System Health</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-700 h-3 rounded-full overflow-hidden mr-2">
                    <div className="bg-blue-500 h-full" style={{ width: '92%' }}></div>
                  </div>
                  <span className="text-sm text-gray-300">92%</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Connection</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Online
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Last Maintenance</span>
                <span className="text-sm text-gray-300">2025-02-18</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Quick Navigation</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Link to="/inventory" className="bg-blue-900/30 hover:bg-blue-900/50 p-4 rounded-lg border border-blue-800 text-center transition-all">
                <Box className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                <h3 className="font-medium text-blue-400">Inventory</h3>
                <p className="text-xs text-gray-400 mt-1">Manage and track components</p>
              </Link>
              
              <Link to="/control" className="bg-blue-900/30 hover:bg-blue-900/50 p-4 rounded-lg border border-blue-800 text-center transition-all">
                <Sliders className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                <h3 className="font-medium text-blue-400">Control Center</h3>
                <p className="text-xs text-gray-400 mt-1">Manage operations</p>
              </Link>
              
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 text-center">
                <span className="inline-block p-2 rounded-full bg-gray-700/50 mx-auto mb-2">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                </span>
                <h3 className="font-medium text-gray-400">More Coming Soon</h3>
                <p className="text-xs text-gray-500 mt-1">Additional features in development</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
