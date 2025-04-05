
import React, { useState } from 'react';
import { RobotDashboardLayout } from '../components/RobotDashboardLayout';
import { AlertCircle, Cpu, Database, Lock, Play, Radio, RotateCw, ShieldAlert, Wifi } from 'lucide-react';

const ControlPage: React.FC = () => {
  const [isRunningInventory, setIsRunningInventory] = useState(false);
  const [isDataCollectionActive, setIsDataCollectionActive] = useState(true);
  const [isTracking, setIsTracking] = useState(false);
  const [securityLevel, setSecurityLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [batteryLevel, setBatteryLevel] = useState(78);
  const [signalStrength, setSignalStrength] = useState(65);
  const [cpuUsage, setCpuUsage] = useState(42);
  const [memoryUsage, setMemoryUsage] = useState(58);
  
  const handleRunInventory = () => {
    setIsRunningInventory(true);
    // Simulate inventory completion
    setTimeout(() => {
      setIsRunningInventory(false);
      // Show success toast or notification here
    }, 3000);
  };
  
  const handleToggleDataCollection = () => {
    setIsDataCollectionActive(!isDataCollectionActive);
  };
  
  const handleToggleTracking = () => {
    setIsTracking(!isTracking);
  };
  
  const handleSecurityLevel = (level: 'low' | 'medium' | 'high') => {
    setSecurityLevel(level);
  };
  
  // Simple progress bar component
  const ProgressBar = ({ value }: { value: number }) => (
    <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
      <div 
        className="h-full bg-blue-500" 
        style={{ width: `${value}%` }}
      />
    </div>
  );
  
  return (
    <RobotDashboardLayout 
      title="Robot Control Center"
      subtitle="Manage operations and system functions"
      currentPage="control"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Control Panels */}
        <div className="space-y-6">
          {/* Inventory Scan Panel */}
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium flex items-center gap-2">
                <Database size={16} /> Inventory Management
              </h2>
              <span className="text-xs px-2 py-1 bg-blue-900/50 text-blue-300 rounded-full">
                System Ready
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Run a full inventory scan to detect and catalog objects
            </p>
            <button
              onClick={handleRunInventory}
              disabled={isRunningInventory}
              className={`w-full py-2 px-4 rounded flex items-center justify-center gap-2 ${
                isRunningInventory 
                  ? 'bg-gray-700 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isRunningInventory ? (
                <>
                  <RotateCw className="animate-spin h-4 w-4" /> 
                  Scanning...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" /> 
                  Run Inventory Scan
                </>
              )}
            </button>
          </div>

          {/* Data Collection Panel */}
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium flex items-center gap-2">
                <Radio size={16} /> Data Collection
              </h2>
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${isDataCollectionActive ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                <span className="text-xs">{isDataCollectionActive ? 'Active' : 'Paused'}</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Control environmental data collection systems
            </p>
            <div className="flex items-center">
              <button
                onClick={handleToggleDataCollection}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  isDataCollectionActive ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isDataCollectionActive ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="ml-3 text-sm">
                {isDataCollectionActive ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>

          {/* Tracking Panel */}
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium flex items-center gap-2">
                <Wifi size={16} /> Location Tracking
              </h2>
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${isTracking ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                <span className="text-xs">{isTracking ? 'Active' : 'Disabled'}</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Enable or disable location tracking features
            </p>
            <div className="flex items-center">
              <button
                onClick={handleToggleTracking}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  isTracking ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isTracking ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="ml-3 text-sm">
                {isTracking ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column - System Status & Security */}
        <div className="space-y-6">
          {/* System Status Panel */}
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h2 className="text-lg font-medium flex items-center gap-2 mb-4">
              <Cpu size={16} /> System Status
            </h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Battery</span>
                  <span className="text-sm">{batteryLevel}%</span>
                </div>
                <ProgressBar value={batteryLevel} />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Signal</span>
                  <span className="text-sm">{signalStrength}%</span>
                </div>
                <ProgressBar value={signalStrength} />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">CPU Usage</span>
                  <span className="text-sm">{cpuUsage}%</span>
                </div>
                <ProgressBar value={cpuUsage} />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Memory</span>
                  <span className="text-sm">{memoryUsage}%</span>
                </div>
                <ProgressBar value={memoryUsage} />
              </div>
            </div>
          </div>

          {/* Security Panel */}
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium flex items-center gap-2">
                <Lock size={16} /> Security Settings
              </h2>
              <div className="flex items-center gap-1">
                <ShieldAlert size={14} className="text-yellow-500" />
                <span className="text-xs text-yellow-500">
                  {securityLevel.charAt(0).toUpperCase() + securityLevel.slice(1)}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Configure security level for robot operations
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleSecurityLevel('low')}
                className={`py-2 text-xs rounded ${
                  securityLevel === 'low' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Low
              </button>
              <button
                onClick={() => handleSecurityLevel('medium')}
                className={`py-2 text-xs rounded ${
                  securityLevel === 'medium' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Medium
              </button>
              <button
                onClick={() => handleSecurityLevel('high')}
                className={`py-2 text-xs rounded ${
                  securityLevel === 'high' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                High
              </button>
            </div>
          </div>

          {/* Alert Panel */}
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <div className="flex items-center gap-3 text-amber-400">
              <AlertCircle size={20} />
              <div>
                <h3 className="font-medium">System Notice</h3>
                <p className="text-sm text-gray-300">
                  Maintenance scheduled for tomorrow at 02:00 UTC
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RobotDashboardLayout>
  );
};

export default ControlPage;
