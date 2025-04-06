import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { toast } from 'sonner';
import UserManagement from '../components/UserManagement';

const SettingsPage = () => {
  const { user } = useAuth();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement profile update logic
    toast.success('Profile updated successfully');
    setIsEditingProfile(false);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Settings</h1>
      
      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <Avatar>
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} />
              <AvatarFallback>{user?.email?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-medium">{user?.email}</h3>
              <p className="text-sm text-gray-500">Role: {user?.role}</p>
            </div>
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                disabled={!isEditingProfile || user?.role !== 'admin'}
              />
            </div>
            {isEditingProfile && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Current Password</label>
                  <Input
                    type="password"
                    value={profileData.currentPassword}
                    onChange={(e) => setProfileData({ ...profileData, currentPassword: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">New Password</label>
                  <Input
                    type="password"
                    value={profileData.newPassword}
                    onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                  <Input
                    type="password"
                    value={profileData.confirmPassword}
                    onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                  />
                </div>
              </>
            )}
            <div className="flex gap-2">
              {!isEditingProfile ? (
                <Button onClick={() => setIsEditingProfile(true)}>Edit Profile</Button>
              ) : (
                <>
                  <Button type="submit">Save Changes</Button>
                  <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* User Management (Admin Only) */}
      {user?.role === 'admin' && <UserManagement />}
    </div>
  );
};

export default SettingsPage; 