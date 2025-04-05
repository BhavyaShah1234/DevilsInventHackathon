import Navbar from '@/components/Navbar';
import React from 'react';
import { Box, Sliders } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen p-4 md:p-8 relative bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white">
      <Navbar />

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

              <Link to="/inspections" className="bg-blue-900/30 hover:bg-blue-900/50 p-4 rounded-lg border border-blue-800 text-center transition-all">
                <svg className="w-8 h-8 mx-auto mb-2 text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
                </svg>
                <h3 className="font-medium text-blue-400">Inspections</h3>
                <p className="text-xs text-gray-400 mt-1">View inspection reports</p>
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