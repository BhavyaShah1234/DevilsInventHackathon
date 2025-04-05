import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Home, Sliders } from 'lucide-react';
import Navbar from '@/components/Navbar';

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  status: 'available' | 'low' | 'depleted';
  lastUpdated: string;
  robotName: string;
}

interface LogEntry {
  message: string;
  timestamp: string;
}

const InventoryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [sortColumn, setSortColumn] = useState<'name' | 'quantity' | 'status' | 'lastUpdated' | 'robotName' | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [expandedDates, setExpandedDates] = useState<string[]>([]);
  const [lastRefresh, setLastRefresh] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const refreshInventory = () => {
    fetch('http://localhost:5001/api/items')
      .then(res => res.json())
      .then(data => {
        setInventoryItems(data);
        setLastRefresh(new Date().toLocaleString());
      })
      .catch(err => console.error('Error refreshing inventory items:', err));
  };

  const refreshLogs = () => {
    fetch('http://localhost:5001/api/logs')
      .then(res => res.json())
      .then(data => setLogs(data))
      .catch(err => console.error('Error refreshing logs:', err));
  };

  useEffect(() => {
    refreshInventory();
    refreshLogs();
  }, []);

  const handleSort = (column: 'name' | 'quantity' | 'status' | 'lastUpdated' | 'robotName') => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getSortArrow = (column: string) => {
    if (sortColumn !== column) return '';
    return sortDirection === 'asc' ? ' ▲' : ' ▼';
  };

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.lastUpdated.split('T')[0].includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (!sortColumn) return 0;
    const valA = a[sortColumn];
    const valB = b[sortColumn];

    if (sortColumn === 'quantity') {
      return sortDirection === 'asc'
        ? (valA as number) - (valB as number)
        : (valB as number) - (valA as number);
    }

    return sortDirection === 'asc'
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  const groupedByDate: { [key: string]: InventoryItem[] } = {};
  sortedItems.forEach(item => {
    const dateKey = item.lastUpdated.split('T')[0];
    if (!groupedByDate[dateKey]) {
      groupedByDate[dateKey] = [];
    }
    groupedByDate[dateKey].push(item);
  });

  const toggleDate = (date: string) => {
    setExpandedDates(prev =>
      prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date]
    );
  };

  const expandAll = () => setExpandedDates(Object.keys(groupedByDate));
  const collapseAll = () => setExpandedDates([]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'low': return 'bg-yellow-100 text-yellow-800';
      case 'depleted': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-white text-black dark:bg-gradient-to-br dark:from-gray-900 dark:via-slate-900 dark:to-gray-950 dark:text-white p-4 md:p-8">
      <Navbar />

      <main>
        <div className="bg-gray-100 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-300 dark:border-gray-700 mb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
            <h2 className="text-xl font-semibold">Inventory Items</h2>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <input
                type="text"
                placeholder="Search items or dates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-black dark:text-white"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="available">Available</option>
                <option value="low">Low</option>
                <option value="depleted">Depleted</option>
              </select>
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={refreshInventory}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
                >
                  Refresh Inventory
                </button>
                {lastRefresh && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Last refresh: {lastRefresh}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={expandAll} className="text-sm text-blue-500 hover:underline">Expand All</button>
                <button onClick={collapseAll} className="text-sm text-blue-500 hover:underline">Collapse All</button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
              <thead className="bg-gray-200 dark:bg-gray-800/70">
                <tr>
                  <th onClick={() => handleSort('name')} className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider cursor-pointer">
                    Item Name{getSortArrow('name')}
                  </th>
                  <th onClick={() => handleSort('quantity')} className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider cursor-pointer">
                    Quantity{getSortArrow('quantity')}
                  </th>
                  <th onClick={() => handleSort('status')} className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider cursor-pointer">
                    Status{getSortArrow('status')}
                  </th>
                  <th onClick={() => handleSort('lastUpdated')} className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider cursor-pointer">
                    Last Updated{getSortArrow('lastUpdated')}
                  </th>
                  <th onClick={() => handleSort('robotName')} className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider cursor-pointer">
                    Robot Name{getSortArrow('robotName')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300 dark:divide-gray-700">
                {Object.keys(groupedByDate).map(date => (
                  <React.Fragment key={date}>
                    <tr onClick={() => toggleDate(date)} className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700/40 bg-gray-100 dark:bg-gray-800">
                      <td colSpan={5} className="px-4 py-2 font-semibold text-blue-600 dark:text-blue-400">
                        📁 {date} {expandedDates.includes(date) ? '▼' : '▶'}
                      </td>
                    </tr>
                    {expandedDates.includes(date) &&
                      groupedByDate[date].map(item => (
                        <tr key={item.id} className="hover:bg-gray-100 dark:hover:bg-gray-700/50">
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">{item.name}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm">{item.quantity}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(item.status)}`}>
                              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {new Date(item.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm">{item.robotName}</td>
                        </tr>
                      ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-100 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-300 dark:border-gray-700">
            <h3 className="text-lg font-medium mb-2 text-gray-800 dark:text-white">Inventory Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Items:</span>
                <span>{inventoryItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Unique Components:</span>
                <span>{inventoryItems.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Low Stock Items:</span>
                <span className="text-yellow-600 dark:text-yellow-400">{inventoryItems.filter(item => item.status === 'low').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Depleted Items:</span>
                <span className="text-red-600 dark:text-red-400">{inventoryItems.filter(item => item.status === 'depleted').length}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-100 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-300 dark:border-gray-700">
            <h3 className="text-lg font-medium mb-2 text-gray-800 dark:text-white">Recent Updates</h3>
            <ul className="space-y-2 text-sm">
              {logs.length === 0 ? (
                <li className="text-gray-600 dark:text-gray-400">No recent updates.</li>
              ) : (
                logs.slice(0, 5).map((log, index) => (
                  <li key={index} className="pb-2 border-b border-gray-300 dark:border-gray-700">
                    <p className="text-blue-600 dark:text-blue-400">{log.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(log.timestamp).toLocaleDateString()}</p>
                  </li>
                ))
              )}
            </ul>
            <button
              onClick={refreshLogs}
              className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded w-full"
            >
              Refresh Logs
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InventoryPage;