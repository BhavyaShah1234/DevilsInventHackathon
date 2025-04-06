import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Welcome, {user?.username}!</h1>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {user?.role === 'admin' && (
              <Button
                className="p-6 h-auto text-left flex flex-col items-start"
                onClick={() => navigate('/inventory')}
              >
                <span className="text-lg font-semibold">Inventory Management</span>
                <span className="text-sm opacity-70">Manage and track inventory items</span>
              </Button>
            )}
            {(user?.role === 'admin' || user?.role === 'inspector') && (
              <Button
                className="p-6 h-auto text-left flex flex-col items-start"
                onClick={() => navigate('/inspections')}
              >
                <span className="text-lg font-semibold">Inspection Points</span>
                <span className="text-sm opacity-70">View and update inspection status</span>
              </Button>
            )}
            <Button
              className="p-6 h-auto text-left flex flex-col items-start"
              onClick={() => navigate('/control')}
            >
              <span className="text-lg font-semibold">Control Panel</span>
              <span className="text-sm opacity-70">Access system controls</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 