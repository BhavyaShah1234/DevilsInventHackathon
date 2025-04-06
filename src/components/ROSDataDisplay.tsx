import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Wifi, WifiOff } from 'lucide-react';

interface ROSData {
  status: 'connected' | 'disconnected' | 'error' | 'message' | 'max_retries';
  message?: string;
  error?: string;
  timestamp?: string;
}

const ROSDataDisplay: React.FC = () => {
  const [rosData, setRosData] = useState<ROSData>({ status: 'disconnected' });
  const [isConnecting, setIsConnecting] = useState(true);
  const [reconnectCount, setReconnectCount] = useState(0);

  useEffect(() => {
    const connectWebSocket = () => {
      setIsConnecting(true);
      const ws = new WebSocket('ws://localhost:3002');

      ws.onopen = () => {
        console.log('Connected to ROS WebSocket server');
        setIsConnecting(false);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Received data:', data);
          setRosData(data);
        } catch (err) {
          console.error('Error parsing ROS data:', err);
          setRosData({
            status: 'error',
            error: 'Failed to parse ROS data',
            timestamp: new Date().toISOString()
          });
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setRosData({
          status: 'error',
          error: 'Failed to connect to ROS server',
          timestamp: new Date().toISOString()
        });
        setIsConnecting(false);
      };

      ws.onclose = () => {
        console.log('Disconnected from ROS WebSocket server');
        setRosData({
          status: 'disconnected',
          timestamp: new Date().toISOString()
        });
        setIsConnecting(false);
        
        // Try to reconnect after 5 seconds
        if (reconnectCount < 5) {
          setTimeout(() => {
            setReconnectCount(prev => prev + 1);
            connectWebSocket();
          }, 5000);
        }
      };

      return () => {
        ws.close();
      };
    };

    connectWebSocket();
  }, [reconnectCount]);

  const getStatusColor = () => {
    switch (rosData.status) {
      case 'connected':
        return 'text-green-500';
      case 'error':
      case 'max_retries':
        return 'text-red-500';
      case 'disconnected':
        return 'text-gray-500';
      default:
        return 'text-yellow-500';
    }
  };

  const getStatusIcon = () => {
    if (isConnecting) {
      return <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />;
    }
    switch (rosData.status) {
      case 'connected':
        return <Wifi className="w-4 h-4 text-green-500" />;
      case 'error':
      case 'max_retries':
      case 'disconnected':
        return <WifiOff className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>ROS2 Talker Messages</span>
          {getStatusIcon()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className={`text-lg font-semibold ${getStatusColor()}`}>
              {isConnecting ? 'Connecting...' : rosData.status}
              {reconnectCount > 0 && reconnectCount < 5 && (
                <span className="text-sm text-gray-500 ml-2">
                  (Attempt {reconnectCount}/5)
                </span>
              )}
            </p>
          </div>
          
          {rosData.error && (
            <div className="flex items-center gap-2 text-red-500">
              <AlertCircle className="w-4 h-4" />
              <span>{rosData.error}</span>
            </div>
          )}

          {rosData.message && (
            <div>
              <p className="text-sm text-gray-500">Message</p>
              <p className="text-lg font-semibold break-words">
                {rosData.message}
              </p>
            </div>
          )}

          {rosData.timestamp && (
            <div>
              <p className="text-sm text-gray-500">Last Update</p>
              <p className="text-lg font-semibold">
                {new Date(rosData.timestamp).toLocaleTimeString()}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ROSDataDisplay; 