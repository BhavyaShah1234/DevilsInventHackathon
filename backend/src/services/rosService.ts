// Type declarations
declare module 'ws';
declare module 'roslib';

import { WebSocketServer, WebSocket } from 'ws';
import ROSLIB from 'roslib';

// Define ROS types
interface ROSMessage {
  data: string;
}

interface ROSTopic {
  subscribe: (callback: (message: ROSMessage) => void) => void;
}

interface ROSConnection {
  on: (event: string, callback: (error?: Error | undefined) => void) => void;
}

interface ROS {
  new (options: { url: string }): ROSConnection;
  Topic: new (options: { ros: ROSConnection; name: string; messageType: string }) => ROSTopic;
}

// Import ROS library with type assertion
const roslib = require('roslib') as {
  Ros: ROS;
  Topic: new (options: { ros: ROSConnection; name: string; messageType: string }) => ROSTopic;
};

class ROSService {
  private ros: ROSLIB.Ros;
  private wss: WebSocketServer;
  private clients: Set<WebSocket>;
  private reconnectAttempts: number;
  private maxReconnectAttempts: number;
  private rosUrl: string;

  constructor() {
    this.rosUrl = 'ws://10.157.220.96:9091';
    this.ros = new ROSLIB.Ros({ url: this.rosUrl });
    this.wss = new WebSocketServer({ port: 3002 });
    this.clients = new Set();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;

    this.setupROSConnection();
    this.setupWebSocketServer();

    // Log initial state
    console.log('ROS Service initialized');
    console.log('Target ROS Bridge URL:', this.rosUrl);
    console.log('WebSocket server port: 3002');
  }

  private setupROSConnection() {
    console.log('Setting up ROS connection...');

    this.ros.on('connection', () => {
      console.log('✅ Connected to ROS2 Web Bridge at', this.rosUrl);
      this.reconnectAttempts = 0;
      this.setupTopics();
      this.broadcast({ status: 'connected', timestamp: new Date().toISOString() });
    });

    this.ros.on('error', (error: Error) => {
      console.error('❌ Error connecting to ROS2 Web Bridge:', error);
      this.broadcast({ status: 'error', error: error.message, timestamp: new Date().toISOString() });
      this.handleReconnect();
    });

    this.ros.on('close', () => {
      console.log('❌ Connection to ROS2 Web Bridge closed');
      this.broadcast({ status: 'disconnected', timestamp: new Date().toISOString() });
      this.handleReconnect();
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`🔄 Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      
      setTimeout(() => {
        try {
          console.log('Creating new ROS connection...');
          this.ros = new ROSLIB.Ros({ url: this.rosUrl });
          this.setupROSConnection();
        } catch (error) {
          console.error('Failed to create new ROS connection:', error);
        }
      }, 5000);
    } else {
      console.error('❌ Max reconnection attempts reached. Please check the ROS2 Web Bridge connection.');
      this.broadcast({ 
        status: 'max_retries',
        message: 'Max reconnection attempts reached. Please check if the ROS2 Web Bridge is running at ' + this.rosUrl,
        timestamp: new Date().toISOString()
      });
    }
  }

  private setupTopics() {
    try {
      console.log('Setting up ROS topics...');
      
      const talkerTopic = new ROSLIB.Topic({
        ros: this.ros,
        name: '/talker',
        messageType: 'std_msgs/String'
      });

      console.log('Subscribing to /talker topic...');
      
      talkerTopic.subscribe((message: any) => {
        console.log('📨 Received message from talker:', message);
        
        if (message && typeof message.data === 'string') {
          this.broadcast({
            status: 'message',
            message: message.data,
            timestamp: new Date().toISOString()
          });
        } else {
          console.warn('⚠️ Received invalid message format:', message);
        }
      });

      console.log('✅ Successfully subscribed to /talker topic');
    } catch (error) {
      console.error('❌ Error setting up topics:', error);
    }
  }

  private setupWebSocketServer() {
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('👤 New client connected');
      this.clients.add(ws);

      // Send current connection status to new client
      ws.send(JSON.stringify({
        status: this.ros.isConnected ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString()
      }));

      ws.on('close', () => {
        console.log('👤 Client disconnected');
        this.clients.delete(ws);
      });

      ws.on('error', (error: Error) => {
        console.error('❌ WebSocket error:', error);
        this.clients.delete(ws);
      });
    });

    console.log('✅ WebSocket server started on port 3002');
  }

  private broadcast(data: any) {
    const message = JSON.stringify(data);
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
}

export default ROSService; 