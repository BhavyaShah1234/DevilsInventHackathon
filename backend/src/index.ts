import express from 'express';
import cors from 'cors';
import { Database } from 'sqlite3';
import path from 'path';
import authRoutes from './routes/auth';
import inventoryRoutes from './routes/inventory';
import qualityRoutes from './routes/quality';
import pathsRoutes from './routes/paths';
import usersRoutes from './routes/users';
import { SchedulerService } from './services/scheduler';
import { notificationsRouter } from './routes/notifications';

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize database
const db = new Database(path.join(__dirname, '../database.sqlite'), (err) => {
  if (err) {
    console.error('Database initialization error:', err);
    process.exit(1);
  }
  console.log('Database connected successfully');
});

// Middleware
app.use(cors({
  origin: ['http://localhost:8082', 'http://localhost:8083', 'http://localhost:8084', 'http://localhost:8085', 'http://localhost:3001', 'http://10.157.220.96:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Add db to request object
declare global {
  namespace Express {
    interface Request {
      db: Database;
      user?: {
        id: number;
        email: string;
        role: string;
        exp?: number;
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
app.use('/api/inventory', inventoryRoutes);
app.use('/api/quality', qualityRoutes);
app.use('/api/paths', pathsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/notifications', notificationsRouter);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  
  // Start the scheduler
  SchedulerService.start();
}); 