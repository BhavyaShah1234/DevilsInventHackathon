import express, { Request } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Database, RunResult } from 'sqlite3';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Hardcoded admin credentials
const ADMIN_EMAIL = 'admin@devilsinvent.com';
const ADMIN_PASSWORD = 'admin123';
const ADMIN_ROLE = 'admin';

// Extend Express Request type to include db
interface CustomRequest extends Request {
  db: Database;
}

interface User {
  id: number;
  email: string;
  password: string;
  role: string;
}

// Validate token
router.post('/validate', async (req: CustomRequest, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Invalid token format' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Register a new user
router.post('/register', async (req: CustomRequest, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const stmt = req.db.prepare(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)'
    );

    stmt.run(email, hashedPassword, 'user', function(this: RunResult, err: Error | null) {
      if (err) {
        if (err.message?.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ message: 'Email already exists' });
        }
        console.error('Registration error:', err);
        return res.status(500).json({ message: 'Registration failed' });
      }

      const userId = this.lastID;
      const token = jwt.sign(
        { id: userId, email, role: 'user' },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        token,
        user: {
          id: userId,
          email,
          role: 'user'
        }
      });
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    return res.status(500).json({ message: 'Registration failed' });
  }
});

// Login user
router.post('/login', async (req: CustomRequest, res) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Check for admin credentials first
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD && role === 'admin') {
      const token = jwt.sign(
        { id: 'admin', email: ADMIN_EMAIL, role: ADMIN_ROLE },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.json({
        token,
        user: {
          id: 'admin',
          email: ADMIN_EMAIL,
          role: ADMIN_ROLE
        }
      });
    }

    // Check for regular user
    const stmt = req.db.prepare('SELECT * FROM users WHERE email = ?');
    stmt.get(email, async (err: Error | null, user: User) => {
      if (err) {
        console.error('Login error:', err);
        return res.status(500).json({ message: 'Login failed' });
      }

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      });
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Login failed' });
  }
});

export default router; 