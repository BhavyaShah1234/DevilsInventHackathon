import { useEffect, useState } from 'react';
import RosService from './RosService';

export const useRos = () => {
  const [isConnected, setIsConnected] = useState(false);
  const rosService = RosService.getInstance();

  useEffect(() => {
    setIsConnected(rosService.isConnected());
  }, []);

  return {
    isConnected,
    subscribe: rosService.subscribe.bind(rosService),
    unsubscribe: rosService.unsubscribe.bind(rosService),
    publish: rosService.publish.bind(rosService),
    callService: rosService.callService.bind(rosService)
  };
}; 