import express from 'express';
import { Database } from 'sqlite3';
import path from 'path';
import { authenticateToken, isAdmin } from '../middleware/auth';

const router = express.Router();
const db = new Database(path.join(__dirname, '../../database.sqlite'));

// Get all robot paths
router.get('/', authenticateToken, (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const userId = req.user.id;

  const query = `
    SELECT rp.*, u.email as created_by_email 
    FROM robot_paths rp
    LEFT JOIN users u ON rp.created_by = u.id
    ORDER BY rp.created_at DESC
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching robot paths:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(rows);
  });
});

// Get a single robot path
router.get('/:id', authenticateToken, (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const userId = req.user.id;

  const query = `
    SELECT rp.*, u.email as created_by_email 
    FROM robot_paths rp
    LEFT JOIN users u ON rp.created_by = u.id
    WHERE rp.id = ?
  `;
  
  db.get(query, [req.params.id], (err, row) => {
    if (err) {
      console.error('Error fetching robot path:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Robot path not found' });
    }
    res.json(row);
  });
});

// Create new robot path (admin only)
router.post('/', authenticateToken, isAdmin, (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const userId = req.user.id;

  const { path_name, path_points, distance, estimated_time, energy_usage } = req.body;
  
  if (!path_name || !path_points || !distance || !estimated_time || !energy_usage) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Validate path_points is a valid JSON array
  try {
    const points = JSON.parse(path_points);
    if (!Array.isArray(points)) {
      throw new Error('path_points must be an array');
    }
  } catch (err) {
    return res.status(400).json({ error: 'Invalid path_points format' });
  }

  const query = `
    INSERT INTO robot_paths (path_name, path_points, distance, estimated_time, energy_usage, created_by)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  
  db.run(query, [
    path_name,
    path_points,
    distance,
    estimated_time,
    energy_usage,
    userId
  ], function(err) {
    if (err) {
      console.error('Error creating robot path:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Log the path creation
    const logQuery = `
      INSERT INTO system_logs (level, message, source)
      VALUES (?, ?, ?)
    `;
    
    db.run(logQuery, [
      'info',
      `New robot path created: ${path_name}`,
      'paths'
    ]);

    res.status(201).json({ id: this.lastID });
  });
});

// Update robot path status (admin only)
router.patch('/:id/status', authenticateToken, isAdmin, (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const userId = req.user.id;

  const { status } = req.body;
  
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  if (!['pending', 'in_progress', 'completed', 'failed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const query = `
    UPDATE robot_paths 
    SET status = ?, completed_at = CASE WHEN ? IN ('completed', 'failed') THEN CURRENT_TIMESTAMP ELSE completed_at END
    WHERE id = ?
  `;
  
  db.run(query, [status, status, req.params.id], function(err) {
    if (err) {
      console.error('Error updating robot path:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Robot path not found' });
    }

    // Log the status update
    const logQuery = `
      INSERT INTO system_logs (level, message, source)
      VALUES (?, ?, ?)
    `;
    
    const logLevel = status === 'failed' ? 'warning' : 'info';
    db.run(logQuery, [
      logLevel,
      `Robot path ${req.params.id} status updated to: ${status}`,
      'paths'
    ]);

    res.json({ success: true });
  });
});

// Get path statistics
router.get('/stats/summary', authenticateToken, (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const userId = req.user.id;

  const query = `
    SELECT 
      COUNT(*) as total_paths,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_paths,
      SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed_paths,
      SUM(CASE WHEN status IN ('pending', 'in_progress') THEN 1 ELSE 0 END) as active_paths,
      AVG(CASE WHEN status = 'completed' THEN distance ELSE NULL END) as avg_distance,
      AVG(CASE WHEN status = 'completed' THEN estimated_time ELSE NULL END) as avg_time,
      AVG(CASE WHEN status = 'completed' THEN energy_usage ELSE NULL END) as avg_energy
    FROM robot_paths
    WHERE created_at >= datetime('now', '-7 days')
  `;
  
  db.get(query, [], (err, row) => {
    if (err) {
      console.error('Error fetching path stats:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(row);
  });
});

// Get inspection points
router.get('/inspection-points', authenticateToken, (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const userId = req.user.id;

  db.all('SELECT * FROM inspection_points ORDER BY priority DESC', [], (err, rows) => {
    if (err) {
      console.error('Error fetching inspection points:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(rows);
  });
});

// Add inspection point (admin only)
router.post('/inspection-points', authenticateToken, isAdmin, (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const userId = req.user.id;

  const { name, x_coordinate, y_coordinate, description, priority } = req.body;
  
  if (!name || x_coordinate === undefined || y_coordinate === undefined) {
    return res.status(400).json({ error: 'Name and coordinates are required' });
  }

  const query = `
    INSERT INTO inspection_points (name, x_coordinate, y_coordinate, description, priority)
    VALUES (?, ?, ?, ?, ?)
  `;
  
  db.run(query, [
    name,
    x_coordinate,
    y_coordinate,
    description || null,
    priority || 1
  ], function(err) {
    if (err) {
      console.error('Error creating inspection point:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Log the inspection point creation
    const logQuery = `
      INSERT INTO system_logs (level, message, source)
      VALUES (?, ?, ?)
    `;
    
    db.run(logQuery, [
      'info',
      `New inspection point created: ${name}`,
      'paths'
    ]);

    res.status(201).json({ id: this.lastID });
  });
});

export default router; 