FROM ros:rolling

# Install ROS2 web bridge
RUN apt-get update && apt-get install -y \
    python3-pip \
    ros-rolling-rosbridge-suite \
    && rm -rf /var/lib/apt/lists/*

# Create a workspace
RUN mkdir -p /ros_ws/src
WORKDIR /ros_ws

# Copy the talker node
COPY talker.py /ros_ws/src/

# Build the workspace
RUN . /opt/ros/rolling/setup.sh && \
    colcon build

# Set up the entry point
COPY entrypoint.sh /
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"] 