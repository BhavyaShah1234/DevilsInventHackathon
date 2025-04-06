import React from 'react';
import { useRos } from '../services/ros/useRos';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

const RosStatus: React.FC = () => {
  const { isConnected } = useRos();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>ROS Connection</span>
          <Badge variant={isConnected ? "default" : "destructive"}>
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">
          {isConnected 
            ? "Connected to ROS bridge server"
            : "Not connected to ROS bridge server"}
        </p>
      </CardContent>
    </Card>
  );
};

export default RosStatus; 