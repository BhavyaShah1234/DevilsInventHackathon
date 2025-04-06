import express from 'express';
import cors from 'cors';
import { Database } from 'sqlite3';
import authRoutes from './routes/auth';

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
    }
  }
}

app.use((req, res, next) => {
  req.db = db;
  next();
});

// Routes
app.use('/api/auth', authRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 