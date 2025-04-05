import React, { useState, useEffect } from 'react';
import { RobotDashboardLayout } from '../components/RobotDashboardLayout';
import { AlertCircle, Cpu, Database, Lock, Play, Radio, RotateCw, ShieldAlert, Wifi } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ControlPage: React.FC = () => {
  const [isRunningInventory, setIsRunningInventory] = useState(false);
  const [isDataCollectionActive, setIsDataCollectionActive] = useState(true);
  const [isTracking, setIsTracking] = useState(false);
  const [securityLevel, setSecurityLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [batteryLevel, setBatteryLevel] = useState(78);
  const [signalStrength, setSignalStrength] = useState(65);
  const [cpuUsage, setCpuUsage] = useState(42);
  const [memoryUsage, setMemoryUsage] = useState(58);
  const [showLiveMap, setShowLiveMap] = useState(false);
  const [robotPosition, setRobotPosition] = useState({ x: 150, y: 200 });
  const [direction, setDirection] = useState<'right' | 'down'>('right');
  const [isEmergencyStopped, setIsEmergencyStopped] = useState(false);
  const navigate = useNavigate();

  const obstacles = [
    { x: 280, y: 250, width: 100, height: 90 },
    { x: 500, y: 150, width: 120, height: 100 },
  ];

  const willCollide = (newX: number, newY: number) => {
    const size = 20;
    return obstacles.some(obs =>
      newX + size > obs.x &&
      newX < obs.x + obs.width &&
      newY + size > obs.y &&
      newY < obs.y + obs.height
    );
  };

  useEffect(() => {
    if (!isRunningInventory) return;

    const interval = setInterval(() => {
      let nextX = robotPosition.x;
      let nextY = robotPosition.y;

      if (direction === 'right') {
        nextX += 8;
        if (nextX > 200) {
          nextX = 200;
          setDirection('down');
        }
      } else if (direction === 'down') {
        nextY += 8;
        if (nextY > 300) {
          nextY = 300;
          setDirection('right');
        }
      }

      if (!willCollide(nextX, nextY)) {
        setRobotPosition({ x: nextX, y: nextY });
      } else {
        console.log("🚫 Obstacle hit!");
        setIsRunningInventory(false);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [isRunningInventory, robotPosition, direction]);

  const handleRunInventory = () => {
    setShowLiveMap(true);
    setIsRunningInventory(true);
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

  const ProgressBar = ({ value }: { value: number }) => (
    <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
      <div className="h-full bg-blue-500" style={{ width: `${value}%` }} />
    </div>
  );

  return (
    <RobotDashboardLayout 
      title="Robot Control Center"
      subtitle="Manage operations and system functions"
      currentPage="control"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
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
              disabled={isRunningInventory || isEmergencyStopped}
              className={`w-full py-2 px-4 rounded flex items-center justify-center gap-2 ${
                isRunningInventory || isEmergencyStopped
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
            {showLiveMap && (
              <div className="mt-6">
                <h2 className="text-white text-lg font-semibold mb-2">Live Robot Map</h2>
                <div className="relative w-full max-w-[900px] h-[600px] border border-gray-600 rounded overflow-hidden mx-auto">
                  <img
                    src="/map.png"
                    alt="Factory Map"
                    className="w-full h-full object-cover"
                  />
                  <div className="fixed bottom-4 right-4 bg-gray-800/90 text-white text-sm px-3 py-1 rounded shadow-lg z-50">
                    🔋 Battery: {batteryLevel}%
                  </div>
                  {obstacles.map((obs, i) => (
                    <div
                      key={i}
                      className="absolute bg-red-500/30 border border-red-500"
                      style={{
                        top: obs.y,
                        left: obs.x,
                        width: obs.width,
                        height: obs.height,
                      }}
                    />
                  ))}
                  <div
                    className="absolute w-6 h-6 bg-red-500 border-2 border-white rounded-full shadow-lg"
                    style={{
                      top: `${robotPosition.y}px`,
                      left: `${robotPosition.x}px`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                </div>
                <div className="mt-4 flex gap-4 justify-center">
                  <button
                    onClick={() => {
                      setIsRunningInventory(false);
                      setIsEmergencyStopped(true);
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                  >
                    🛑 Emergency Stop
                  </button>
                  <button
                    onClick={() => setIsRunningInventory(true)}
                    disabled={isEmergencyStopped}
                    className={`px-4 py-2 rounded ${
                      isEmergencyStopped
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    } text-white`}
                  >
                    ▶️ Resume
                  </button>
                  <button
                    onClick={() => setIsRunningInventory(false)}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
                  >
                    ⏸ Pause
                  </button>
                </div>
                {isEmergencyStopped && (
                  <div className="mt-4 text-center text-red-400 text-sm font-medium">
                    ⚠️ Emergency Stop activated. You have stopped the robot. Please restart the system to resume operations.
                  </div>
                )}
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => navigate('/inventory')}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-5 py-2 rounded shadow"
                  >
                    🔍 View Inspection
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Data Collection and Tracking Panels go here */}

        </div>

        {/* Right Column - System Status & Security goes here */}

      </div>
    </RobotDashboardLayout>
  );
};

export default ControlPage;
