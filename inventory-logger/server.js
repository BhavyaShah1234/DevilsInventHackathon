const express = require('express');
const cors = require('cors');
const Stream = require('node-rtsp-stream');
const app = express();

app.use(cors());
app.use(express.json());

const logRoutes = require('./routes/logRoutes');
app.use('/api/logs', logRoutes);

const itemRoutes = require('./routes/itemRoutes');
app.use('/api/items', itemRoutes);

// Start the server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

// RTSP stream configuration
let stream;
const startStream = (rtspUrl) => {
    stream = new Stream({
        name: 'liveStream',
        streamUrl: rtspUrl,
        wsPort: 9999,
        ffmpegOptions: {
            '-stats': '',
            '-r': 30
        }
    });
};

// Endpoint to start streaming
app.post('/api/stream/start', (req, res) => {
    const { rtspUrl } = req.body;
    if (!rtspUrl) {
        return res.status(400).json({ error: 'RTSP URL is required' });
    }
    startStream(rtspUrl);
    res.json({ message: 'RTSP stream started', wsPort: 9999 }); // Include wsPort in response
});
