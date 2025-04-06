import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Notification } from '../types';

// Mock data for development
const mockNotifications: Notification[] = [
  {
    id: '1',
    message: 'System update available',
    date: new Date().toISOString(),
    time: new Date().toLocaleTimeString(),
    archived: false
  },
  {
    id: '2',
    message: 'New inventory items added',
    date: new Date().toISOString(),
    time: new Date().toLocaleTimeString(),
    archived: false
  }
];

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      // In development, always use mock data
      if (import.meta.env.DEV) {
        console.log('Using mock notifications data for development');
        setNotifications(mockNotifications);
        setError(null);
        return;
      }
      
      // In production, try to fetch from API
      const data = await api.notifications.getAll();
      setNotifications(data);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch notifications');
      // In production, don't set mock data on error
      if (import.meta.env.DEV) {
        setNotifications(mockNotifications);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const archiveNotification = async (id: string) => {
    try {
      if (!import.meta.env.DEV) {
        await api.notifications.archive(id);
      }
      setNotifications(prev => prev.map(n => 
        n.id === id ? { ...n, archived: true } : n
      ));
      setError(null);
    } catch (error) {
      console.error('Failed to archive notification:', error);
      if (!import.meta.env.DEV) {
        setError(error instanceof Error ? error.message : 'Failed to archive notification');
      }
    }
  };

  const restoreNotification = async (id: string) => {
    try {
      if (!import.meta.env.DEV) {
        await api.notifications.restore(id);
      }
      setNotifications(prev => prev.map(n => 
        n.id === id ? { ...n, archived: false } : n
      ));
      setError(null);
    } catch (error) {
      console.error('Failed to restore notification:', error);
      if (!import.meta.env.DEV) {
        setError(error instanceof Error ? error.message : 'Failed to restore notification');
      }
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return {
    notifications,
    isLoading,
    error,
    fetchNotifications,
    archiveNotification,
    restoreNotification
  };
}; 