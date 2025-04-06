import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { Database } from 'sqlite3';
import path from 'path';
import { isAdmin } from '../middleware/auth';

interface User {
  id: number;
  email: string;
  role: string;
}

const router = Router();
const db = new Database(path.join(__dirname, '../../database.sqlite'));

// Get all inventory items
router.get('/', authenticateToken, async (req, res) => {
  db.all('SELECT * FROM inventory ORDER BY component_name', [], (err, rows) => {
    if (err) {
      console.error('Error fetching inventory:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(rows);
  });
});

// Get a single inventory item
router.get('/:id', authenticateToken, (req, res) => {
  db.get('SELECT * FROM inventory WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      console.error('Error fetching inventory item:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }
    res.json(row);
  });
});

// Add new inventory item (admin only)
router.post('/', authenticateToken, isAdmin, (req, res) => {
  const { component_name, description, quantity, min_threshold, location } = req.body;
  
  if (!component_name || quantity === undefined) {
    return res.status(400).json({ error: 'Component name and quantity are required' });
  }

  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const userId = (req.user as User).id;

  const query = `
    INSERT INTO inventory (component_name, description, quantity, min_threshold, location, updated_by)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  
  db.run(query, [
    component_name,
    description || null,
    quantity,
    min_threshold || 10,
    location || null,
    userId
  ], function(err) {
    if (err) {
      console.error('Error adding inventory item:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    
    // Log the inventory addition
    const logQuery = `
      INSERT INTO system_logs (level, message, source)
      VALUES (?, ?, ?)
    `;
    
    db.run(logQuery, [
      'info',
      `New inventory item added: ${component_name}`,
      'inventory'
    ]);

    res.status(201).json({ id: this.lastID });
  });
});

// Update inventory item quantity (admin only)
router.patch('/:id', authenticateToken, isAdmin, (req, res) => {
  const { quantity } = req.body;
  
  if (quantity === undefined) {
    return res.status(400).json({ error: 'Quantity is required' });
  }

  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const userId = (req.user as User).id;

  db.run(
    'UPDATE inventory SET quantity = ?, updated_by = ?, last_updated = CURRENT_TIMESTAMP WHERE id = ?',
    [quantity, userId, req.params.id],
    function(err) {
      if (err) {
        console.error('Error updating inventory:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Inventory item not found' });
      }

      // Log the inventory update
      const logQuery = `
        INSERT INTO system_logs (level, message, source)
        VALUES (?, ?, ?)
      `;
      
      db.run(logQuery, [
        'info',
        `Inventory item ${req.params.id} updated to quantity: ${quantity}`,
        'inventory'
      ]);

      res.json({ success: true });
    }
  );
});

// Delete inventory item (admin only)
router.delete('/:id', authenticateToken, isAdmin, (req, res) => {
  db.run('DELETE FROM inventory WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      console.error('Error deleting inventory item:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    // Log the inventory deletion
    const logQuery = `
      INSERT INTO system_logs (level, message, source)
      VALUES (?, ?, ?)
    `;
    
    db.run(logQuery, [
      'warning',
      `Inventory item ${req.params.id} deleted`,
      'inventory'
    ]);

    res.json({ success: true });
  });
});

// Get low stock alerts
router.get('/alerts/low-stock', authenticateToken, (req, res) => {
  const query = `
    SELECT * FROM inventory 
    WHERE quantity <= min_threshold 
    ORDER BY quantity ASC
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching low stock alerts:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(rows);
  });
});

export default router; 