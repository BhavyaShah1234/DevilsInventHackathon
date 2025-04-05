import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Home, Sliders } from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  status: 'available' | 'low' | 'depleted';
  lastUpdated: string;
}

const InventoryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([
    { 
      id: '1', 
      name: 'Sensor Module A', 
      quantity: 24, 
      status: 'available', 
      lastUpdated: '2025-03-30' 
    },
    { 
      id: '2', 
      name: 'Battery Pack', 
      quantity: 5, 
      status: 'low', 
      lastUpdated: '2025-04-01' 
    },
    { 
      id: '3', 
      name: 'Processing Unit', 
      quantity: 12, 
      status: 'available', 
      lastUpdated: '2025-03-25' 
    },
    { 
      id: '4', 
      name: 'Motor Controller', 
      quantity: 0, 
      status: 'depleted', 
      lastUpdated: '2025-04-03' 
    },
    { 
      id: '5', 
      name: 'Camera Module', 
      quantity: 8, 
      status: 'available', 
      lastUpdated: '2025-03-28' 
    },
  ]);

  const filteredItems = inventoryItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'low': return 'bg-yellow-100 text-yellow-800';
      case 'depleted': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-950 text-white p-4 md:p-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Robot Inventory</h1>
        <p className="text-gray-400 mt-2">Manage and track robot components</p>
      </header>

      {/* Navigation */}
      <nav className="mb-8 bg-black/30 backdrop-blur-lg rounded-lg border border-gray-800 overflow-hidden">
        <ul className="flex flex-wrap">
          <li className="flex-1">
            <Link 
              to="/" 
              className="flex items-center justify-center gap-2 py-3 px-4 text-center transition-colors hover:bg-gray-800/50"
            >
              <Home size={18} />
              <span className="hidden sm:inline">Information</span>
            </Link>
          </li>
          <li className="flex-1">
            <Link 
              to="/inventory" 
              className="flex items-center justify-center gap-2 py-3 px-4 text-center transition-colors bg-blue-900/50 border-b-2 border-blue-500 text-blue-400"
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
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 mb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
            <h2 className="text-xl font-semibold">Inventory Items</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800/70">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Item Name
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Last Updated
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-700/50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        {item.name}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(item.status)}`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                        {item.lastUpdated}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-400">
                      No items found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h3 className="text-lg font-medium mb-2">Inventory Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Items:</span>
                <span>{inventoryItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Unique Components:</span>
                <span>{inventoryItems.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Low Stock Items:</span>
                <span className="text-yellow-400">{inventoryItems.filter(item => item.status === 'low').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Depleted Items:</span>
                <span className="text-red-400">{inventoryItems.filter(item => item.status === 'depleted').length}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h3 className="text-lg font-medium mb-2">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm">
                Order New Components
              </button>
              <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded text-sm">
                Generate Inventory Report
              </button>
            </div>
          </div>
          
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h3 className="text-lg font-medium mb-2">Recent Updates</h3>
            <ul className="space-y-2 text-sm">
              <li className="pb-2 border-b border-gray-700">
                <p className="text-blue-400">Battery Pack stock reduced</p>
                <p className="text-xs text-gray-400">2025-04-01</p>
              </li>
              <li className="pb-2 border-b border-gray-700">
                <p className="text-blue-400">Motor Controller depleted</p>
                <p className="text-xs text-gray-400">2025-04-03</p>
              </li>
              <li>
                <p className="text-blue-400">New Sensor Modules arrived</p>
                <p className="text-xs text-gray-400">2025-03-30</p>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InventoryPage;