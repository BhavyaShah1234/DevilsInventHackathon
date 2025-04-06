#!/bin/bash

# Source ROS setup
source /opt/ros/rolling/setup.bash

# Start the ROS bridge
ros2 launch rosbridge_server rosbridge_websocket_launch.xml port:=9091 &

# Start the talker node
python3 /ros_ws/src/talker.py &

# Keep the container running
tail -f /dev/null 