import express from 'express';
import { authenticateToken, isAdmin } from '../middleware/auth';
import { Database } from 'sqlite3';
import bcrypt from 'bcrypt';

const router = express.Router();

// Get all users (admin only)
router.get('/', authenticateToken, isAdmin, (req, res) => {
  const db = req.db;
  db.all('SELECT id, email, role, created_at FROM users', [], (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

// Create new user (admin only)
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  const { email, password, role } = req.body;
  const db = req.db;

  if (!email || !password || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Validate password length
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  // Validate role
  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  try {
    // Check if user already exists
    const existingUser = await new Promise((resolve, reject) => {
      db.get('SELECT id FROM users WHERE email = ?', [email], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const result = await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
        [email, hashedPassword, role],
        function(err) {
          if (err) reject(err);
          resolve(this);
        }
      );
    });

    res.status(201).json({
      id: (result as any).lastID,
      email,
      role,
      message: 'User created successfully'
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Update user (admin only)
router.put('/:id', authenticateToken, isAdmin, (req, res) => {
  const { id } = req.params;
  const { email, role } = req.body;
  const db = req.db;

  if (!email || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  db.run(
    'UPDATE users SET email = ?, role = ? WHERE id = ?',
    [email, role, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ id, email, role });
    }
  );
});

// Delete user (admin only)
router.delete('/:id', authenticateToken, isAdmin, (req, res) => {
  const { id } = req.params;
  const db = req.db;

  db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(204).send();
  });
});

export default router; 