
import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { Database } from 'sqlite3';
import { authenticateToken, requireRole } from './auth';

const router = express.Router();

interface CustomRequest extends Request {
  db: Database;
  user?: {
    id: string | number;
    email: string;
    role: string;
  };
}

// Get all users
router.get('/', authenticateToken, requireRole(['admin']), (req: CustomRequest, res: Response) => {
  const query = 'SELECT id, email, role FROM users';
  req.db.all(query, [], (err: Error | null, rows: any[]) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ message: 'Failed to fetch users' });
    }
    res.json(rows);
  });
});

// Create a new user
router.post('/', authenticateToken, requireRole(['admin']), async (req: CustomRequest, res: Response) => {
  const { email, password, role = 'user' } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  if (!['admin', 'user'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const stmt = req.db.prepare(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)'
    );

    stmt.run(email, hashedPassword, role, function(this: { lastID: number }, err: Error | null) {
      if (err) {
        if (err.message?.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ message: 'Email already exists' });
        }
        console.error('Error creating user:', err);
        return res.status(500).json({ message: 'Failed to create user' });
      }

      res.status(201).json({
        id: this.lastID,
        email,
        role
      });
    });
  } catch (err) {
    console.error('Error creating user:', err);
    return res.status(500).json({ message: 'Failed to create user' });
  }
});

// Delete a user
router.delete('/:id', authenticateToken, requireRole(['admin']), (req: CustomRequest, res: Response) => {
  const { id } = req.params;

  // Prevent deleting the last admin
  if (id === 'admin') {
    return res.status(400).json({ message: 'Cannot delete the admin user' });
  }

  const stmt = req.db.prepare('DELETE FROM users WHERE id = ?');
  stmt.run(id, function(this: { changes: number }, err: Error | null) {
    if (err) {
      console.error('Error deleting user:', err);
      return res.status(500).json({ message: 'Failed to delete user' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  });
});

// Update a user
router.put('/:id', authenticateToken, requireRole(['admin']), async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  const { email, password, role } = req.body;

  if (!email && !password && !role) {
    return res.status(400).json({ message: 'No fields to update' });
  }

  if (role && !['admin', 'user'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    let query = 'UPDATE users SET ';
    const params: any[] = [];
    const updates: string[] = [];

    if (email) {
      updates.push('email = ?');
      params.push(email);
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updates.push('password = ?');
      params.push(hashedPassword);
    }

    if (role) {
      updates.push('role = ?');
      params.push(role);
    }

    query += updates.join(', ') + ' WHERE id = ?';
    params.push(id);

    const stmt = req.db.prepare(query);
    stmt.run(params, function(this: { changes: number }, err: Error | null) {
      if (err) {
        console.error('Error updating user:', err);
        return res.status(500).json({ message: 'Failed to update user' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ message: 'User updated successfully' });
    });
  } catch (err) {
    console.error('Error updating user:', err);
    return res.status(500).json({ message: 'Failed to update user' });
  }
});

export default router; 