import WebSocket from 'ws';

const ws = new WebSocket('ws://10.157.220.96:9090');

console.log('Testing ROS2 Web Bridge connection...');

ws.on('open', () => {
  console.log('✅ Connected to ROS2 Web Bridge');
  
  // Send a test message
  const testMessage = {
    op: 'subscribe',
    topic: '/talker',
    type: 'std_msgs/String'
  };
  
  ws.send(JSON.stringify(testMessage));
  console.log('✅ Sent subscription request for /talker topic');
});

ws.on('message', (data) => {
  console.log('✅ Received message:', data.toString());
});

ws.on('error', (error) => {
  console.error('❌ WebSocket error:', error);
});

ws.on('close', () => {
  console.log('❌ Connection closed');
}); 