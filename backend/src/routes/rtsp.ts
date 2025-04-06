import express from 'express';
// import NodeMediaServer from 'node-media-server'; // No need to import again, assuming it's in index.ts and accessible

const router = express.Router();

// Assuming nms is accessible globally from index.ts
declare global {
  var nms: any; // Declare nms as a global variable, type 'any' for now
}

router.post('/start-stream', (req, res) => {
  const { rtspUrl, ffmpegPath } = req.body;

  if (!rtspUrl) {
    return res.status(400).json({ error: 'RTSP URL is required' });
  }

  const relayTask = {
    app: 'live',
    name: 'stream', // You can generate a unique name if needed
    to: rtspUrl,
    rtsp_transport: 'tcp',
    mode: 'static',
    ffmpeg: ffmpegPath || '/usr/bin/ffmpeg' // Use provided path or default
  };

  global.nms.relayApp.addTask(relayTask);
  res.json({ message: 'RTSP stream started', task: relayTask });
});

router.post('/stop-stream', (req, res) => {
  global.nms.relayApp.removeTask('stream'); // Assuming task name is 'stream'
  res.json({ message: 'RTSP stream stopped' });
});

export default router;
