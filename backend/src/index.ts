import express from 'express';
import cors from 'cors';
import { Database } from 'sqlite3';
import path from 'path';
import authRoutes from './routes/auth';
import inventoryRoutes from './routes/inventory';
import qualityRoutes from './routes/quality';
import pathsRoutes from './routes/paths';
import { SchedulerService } from './services/scheduler';

const app = express();
const port = process.env.PORT || 3001;

// Initialize database
const db = new Database(path.join(__dirname, '../database.sqlite'));

// Middleware
app.use(cors());
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

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  
  // Start the scheduler
  SchedulerService.start();
}); 