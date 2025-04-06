import express from 'express';
import bcrypt from 'bcrypt';
import { authenticateToken, requireRole } from './auth';
import type { CustomRequest } from './auth';

const router = express.Router();

// Apply authentication middleware to all user routes
router.use(authenticateToken);

// Get user profile (authenticated users)
router.get('/profile', async (req: CustomRequest, res) => {
  try {
    const stmt = req.db.prepare('SELECT id, email, role FROM users WHERE id = ?');
    stmt.get(req.user?.id, (err: Error | null, user: any) => {
      if (err) {
        console.error('Error fetching user profile:', err);
        return res.status(500).json({ message: 'Failed to fetch profile' });
      }
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    });
  } catch (err) {
    console.error('Error in profile route:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update user profile (authenticated users)
router.put('/profile', async (req: CustomRequest, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const stmt = req.db.prepare('UPDATE users SET email = ? WHERE id = ?');
    stmt.run(email, req.user?.id, function(err: Error | null) {
      if (err) {
        console.error('Error updating profile:', err);
        return res.status(500).json({ message: 'Failed to update profile' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ message: 'Profile updated successfully' });
    });
  } catch (err) {
    console.error('Error in update profile route:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Change password (authenticated users)
router.put('/change-password', async (req: CustomRequest, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current and new passwords are required' });
  }

  try {
    const stmt = req.db.prepare('SELECT password FROM users WHERE id = ?');
    stmt.get(req.user?.id, async (err: Error | null, user: any) => {
      if (err) {
        console.error('Error fetching user:', err);
        return res.status(500).json({ message: 'Failed to change password' });
      }

      const validPassword = await bcrypt.compare(currentPassword, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      const updateStmt = req.db.prepare('UPDATE users SET password = ? WHERE id = ?');
      updateStmt.run(hashedPassword, req.user?.id, function(this: any, err: Error | null) {
        if (err) {
          console.error('Error updating password:', err);
          return res.status(500).json({ message: 'Failed to change password' });
        }
        res.json({ message: 'Password changed successfully' });
      });
    });
  } catch (err) {
    console.error('Error in change password route:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
