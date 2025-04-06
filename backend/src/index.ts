import express from 'express';
import cors from 'cors';
import { Database } from 'sqlite3';
import authRoutes from './routes/auth';
import inventoryRoutes from './routes/inventory';
import qualityRoutes from './routes/quality';
import pathsRoutes from './routes/paths';

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const db = new Database('./database.sqlite');

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
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 