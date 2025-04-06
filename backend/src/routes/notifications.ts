import express from 'express';
import { Database } from 'sqlite3';
import path from 'path';

const router = express.Router();
const db = new Database(path.join(__dirname, '../../database.sqlite'));

// Get all notifications
router.get('/', (req, res) => {
  db.all('SELECT * FROM notifications ORDER BY date DESC, time DESC', (err, rows) => {
    if (err) {
      console.error('Error fetching notifications:', err);
      return res.status(500).json({ error: 'Failed to fetch notifications' });
    }
    res.json(rows);
  });
});

// Archive a notification
router.post('/:id/archive', (req, res) => {
  const { id } = req.params;
  db.run('UPDATE notifications SET archived = 1 WHERE id = ?', [id], (err) => {
    if (err) {
      console.error('Error archiving notification:', err);
      return res.status(500).json({ error: 'Failed to archive notification' });
    }
    res.json({ message: 'Notification archived successfully' });
  });
});

// Restore a notification
router.post('/:id/restore', (req, res) => {
  const { id } = req.params;
  db.run('UPDATE notifications SET archived = 0 WHERE id = ?', [id], (err) => {
    if (err) {
      console.error('Error restoring notification:', err);
      return res.status(500).json({ error: 'Failed to restore notification' });
    }
    res.json({ message: 'Notification restored successfully' });
  });
});

export const notificationsRouter = router; 