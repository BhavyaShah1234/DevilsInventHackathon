import express from 'express';
import { Database } from 'sqlite3';
import path from 'path';
import { authenticateToken, isAdmin } from '../middleware/auth';

const router = express.Router();
const db = new Database(path.join(__dirname, '../../database.sqlite'));

interface User {
  id: number;
  email: string;
  role: string;
}

// Get all quality checks
router.get('/', authenticateToken, (req, res) => {
  db.all('SELECT * FROM quality_checks ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      console.error('Error fetching quality checks:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(rows);
  });
});

// Get a single quality check
router.get('/:id', authenticateToken, (req, res) => {
  db.get('SELECT * FROM quality_checks WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      console.error('Error fetching quality check:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Quality check not found' });
    }
    res.json(row);
  });
});

// Create new quality check
router.post('/', authenticateToken, (req, res) => {
  const { component_id, inspection_point_id, status, notes } = req.body;
  
  if (!component_id || !inspection_point_id || !status) {
    return res.status(400).json({ error: 'Component ID, inspection point ID, and status are required' });
  }

  // We know req.user exists because of authenticateToken middleware
  const userId = (req.user as User).id;

  const query = `
    INSERT INTO quality_checks (component_id, inspection_point_id, status, notes, inspector_id)
    VALUES (?, ?, ?, ?, ?)
  `;
  
  db.run(query, [
    component_id,
    inspection_point_id,
    status,
    notes || null,
    userId
  ], function(err) {
    if (err) {
      console.error('Error creating quality check:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    
    // Log the quality check creation
    const logQuery = `
      INSERT INTO system_logs (level, message, source)
      VALUES (?, ?, ?)
    `;
    
    db.run(logQuery, [
      'info',
      `New quality check created for component ${component_id}`,
      'quality'
    ]);

    res.status(201).json({ id: this.lastID });
  });
});

// Update quality check status
router.patch('/:id', authenticateToken, (req, res) => {
  const { status, notes } = req.body;
  
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  // We know req.user exists because of authenticateToken middleware
  const userId = (req.user as User).id;

  const query = `
    UPDATE quality_checks 
    SET status = ?, notes = ?, inspector_id = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  
  db.run(query, [status, notes || null, userId, req.params.id], function(err) {
    if (err) {
      console.error('Error updating quality check:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Quality check not found' });
    }

    // Log the quality check update
    const logQuery = `
      INSERT INTO system_logs (level, message, source)
      VALUES (?, ?, ?)
    `;
    
    db.run(logQuery, [
      'info',
      `Quality check ${req.params.id} updated to status: ${status}`,
      'quality'
    ]);

    res.json({ success: true });
  });
});

// Get quality check statistics
router.get('/stats/summary', authenticateToken, (req, res) => {
  const query = `
    SELECT 
      status,
      COUNT(*) as count,
      strftime('%Y-%m-%d', created_at) as date
    FROM quality_checks
    GROUP BY status, date
    ORDER BY date DESC, status
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching quality check stats:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(rows);
  });
});

// Get recent failures
router.get('/alerts/failures', authenticateToken, (req, res) => {
  const query = `
    SELECT qc.*, u.email as inspector_email 
    FROM quality_checks qc
    LEFT JOIN users u ON qc.inspector_id = u.id
    WHERE qc.status = 'fail'
    ORDER BY qc.created_at DESC
    LIMIT 10
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching quality check failures:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(rows);
  });
});

export default router; 