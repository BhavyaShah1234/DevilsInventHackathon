import express from 'express';
import cors from 'cors';
import path from 'path';
import sqlite3 from 'sqlite3';
import authRoutes from './routes/auth';
import usersRoutes from './routes/users';
import NodeMediaServer from 'node-media-server';
import rtspRoutes from './routes/rtsp';

const app = express();
const port = process.env.PORT || 3001;

const config = {
  rtsp: {
    port: 8554,
  },
  logType: 3,
};

declare global {
  var nms: any;
}

global.nms = new NodeMediaServer(config);
nms.run();

declare global {
  var isDummyDataEnabled: boolean;
}
global.isDummyDataEnabled = true; // Initially enabled

function generateDummyData() {
  const x = Math.random() * 10;
  const y = Math.random() * 10;
  const status = `Unit ${Math.floor(Math.random() * 20) + 1}: ${Math.random() > 0.5 ? 'Inspected' : 'Pending'}`;
  const timestamp = new Date().toISOString();
  return {
    robot: { x, y },
    status,
    timestamp,
  };
}

setInterval(() => {
  if (global.isDummyDataEnabled) {
    const dummyData = generateDummyData();
    console.log('Dummy data:', dummyData);
    // TODO: Push dummyData to RTSP stream - will need to use ffmpeg to push video stream
  }
}, 1000);

// Initialize database
const dbPath = path.join(__dirname, '..', 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err: Error | null) => {
  if (err) {
    console.error('Error connecting to database:', err);
    process.exit(1);
  }
  console.log('Connected to SQLite database');
});

// Middleware
app.use(cors());
app.use(express.json());

// Add database to request object
declare global {
  namespace Express {
    interface Request {
      db: sqlite3.Database;
      user?: {
        id: string | number;
        email: string;
        role: string;
      };
    }
  }
}

app.use((req, res, next) => {
  req.db = db;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/rtsp', rtspRoutes);

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
