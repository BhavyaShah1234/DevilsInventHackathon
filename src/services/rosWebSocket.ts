import { useEffect, useRef, useState } from 'react';

export interface ROSData {
  // Define your ROS data structure here
  // Example:
  timestamp: number;
  data: any;
}

export const useROSWebSocket = (url: string) => {
  const ws = useRef<WebSocket | null>(null);
  const [data, setData] = useState<ROSData | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      console.log('Connected to ROS websocket');
      setIsConnected(true);
    };

    ws.current.onmessage = (event) => {
      try {
        const rosData: ROSData = JSON.parse(event.data);
        setData(rosData);
      } catch (error) {
        console.error('Error parsing ROS data:', error);
      }
    };

    ws.current.onclose = () => {
      console.log('Disconnected from ROS websocket');
      setIsConnected(false);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [url]);

  return { data, isConnected };
}; 