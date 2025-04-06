import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Database } from 'sqlite3';

const router = express.Router();

interface User {
  id: number;
  email: string;
  password: string;
  role: 'user' | 'admin' | 'super-admin';
  permissions: string;
}

interface DecodedUser {
  id: string | number;
  email: string;
  role: 'user' | 'admin' | 'super-admin';
  permissions: string[];
}

interface CustomRequest extends Request {
  db: Database;
  user?: DecodedUser;
}

// Middleware to check if user has required role
export const requireRole = (roles: string[]): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    const customReq = req as CustomRequest;
    if (!customReq.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (customReq.user.role === 'super-admin') {
      return next();
    }

    if (!roles.includes(customReq.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  };
};

// Middleware to check specific permissions
export const requirePermission = (permissions: string[]): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    const customReq = req as CustomRequest;
    if (!customReq.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (customReq.user.role === 'super-admin') {
      return next();
    }

    const hasPermission = permissions.some(permission => 
      customReq.user?.permissions?.includes(permission)
    );

    if (!hasPermission) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  };
};

// Middleware to authenticate token
export const authenticateToken: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const customReq = req as CustomRequest;
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, 'XAEkp@7043') as DecodedUser;
    customReq.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Register route
router.post('/register', (req: Request, res: Response) => {
  const customReq = req as CustomRequest;
  const { email, password } = req.body;
  const role = 'user';  // Default role for new registrations
  const permissions = ['read'];  // Default permissions

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    bcrypt.hash(password, 10, (err, hashedPassword) => {
if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).json({ message: 'Error hashing password' });
          }

      const stmt = customReq.db.prepare('INSERT INTO users (email, password, role, permissions) VALUES (?, ?, ?, ?)');
      
      stmt.run(
        email, 
        hashedPassword, 
        role, 
        JSON.stringify(permissions), 
        function(this: { lastID: number }, err: Error | null) {
          if (err) {
            console.error('Error creating user in database:', err);
            if (err.message.includes('UNIQUE constraint failed')) {
              return res.status(400).json({ message: 'Email already exists' });
            }
            return res.status(500).json({ message: 'Error creating user' });
          }

          const userId = this.lastID;
          const token = jwt.sign(
            { id: userId, email, role, permissions },
            'XAEkp@7043',
            { expiresIn: '24h' }
          );

          res.status(201).json({
            token,
            user: {
              id: userId,
              email,
              role,
              permissions
            }
          });
        }
      );
    });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Login route
router.post('/login', (req: Request, res: Response) => {
  const customReq = req as CustomRequest;
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    customReq.db.get(
      'SELECT * FROM users WHERE email = ?', 
      [email], 
      async (err: Error | null, row: User | undefined) => {
        if (err) {
          console.error('Error finding user:', err);
          return res.status(500).json({ message: 'Error finding user' });
        }

        if (!row) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, row.password);
        if (!validPassword) {
          console.error('Invalid password for user:', email);
          return res.status(401).json({ message: 'Invalid credentials' });
        }

        try {
          const permissions = JSON.parse(row.permissions || '[]');
          
          if (row.role === 'super-admin') {
            permissions.push('all');
          }

          const token = jwt.sign(
            { id: row.id, email: row.email, role: row.role, permissions },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
          );

          res.json({
            token,
            user: {
              id: row.id,
              email: row.email,
              role: row.role,
              permissions
            }
          });
        } catch (parseError) {
          console.error('Error parsing permissions:', parseError);
          return res.status(500).json({ message: 'Error processing user data' });
        }
      }
    );
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Error during login' });
  }
});

export const authRouter = router;
export type { CustomRequest };
export default router;
