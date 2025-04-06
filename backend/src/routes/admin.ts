import express from 'express';
import { authenticateToken, requireRole } from './auth';
import CustomRequest from './auth';

const router = express.Router();

// Apply authentication middleware to all admin routes
router.use(authenticateToken);

// Get all users (admin only)
router.get('/users', requireRole(['admin']), async (req: CustomRequest, res) => {
  try {
    const stmt = req.db.prepare('SELECT id, email, role FROM users');
    stmt.all((err: Error | null, users: any[]) => {
      if (err) {
        console.error('Error fetching users:', err);
        return res.status(500).json({ message: 'Failed to fetch users' });
      }
      res.json(users);
    });
  } catch (err) {
    console.error('Error in users route:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update user role (admin only)
router.put('/users/:id/role', requireRole(['admin']), async (req: CustomRequest, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!['admin', 'user'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    const stmt = req.db.prepare('UPDATE users SET role = ? WHERE id = ?');
    stmt.run(role, id, function(this: any, err: Error | null) {
      if (err) {
        console.error('Error updating user role:', err);
        return res.status(500).json({ message: 'Failed to update user role' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ message: 'User role updated successfully' });
    });
  } catch (err) {
    console.error('Error in update role route:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete user (admin only)
router.delete('/users/:id', requireRole(['admin']), async (req: CustomRequest, res) => {
  const { id } = req.params;

  try {
    const stmt = req.db.prepare('DELETE FROM users WHERE id = ?');
    stmt.run(id, function(this: any, err: Error | null) {
      if (err) {
        console.error('Error deleting user:', err);
        return res.status(500).json({ message: 'Failed to delete user' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ message: 'User deleted successfully' });
    });
  } catch (err) {
    console.error('Error in delete user route:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get system logs (admin only)
router.get('/logs', requireRole(['admin']), async (req: CustomRequest, res) => {
  try {
    const stmt = req.db.prepare('SELECT * FROM system_logs ORDER BY timestamp DESC LIMIT 100');
    stmt.all((err: Error | null, logs: any[]) => {
      if (err) {
        console.error('Error fetching logs:', err);
        return res.status(500).json({ message: 'Failed to fetch logs' });
      }
      res.json(logs);
    });
  } catch (err) {
    console.error('Error in logs route:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
