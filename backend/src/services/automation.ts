import { Database } from 'sqlite3';
import path from 'path';

const db = new Database(path.join(__dirname, '../../database.sqlite'));

interface InventoryItem {
  id: number;
  component_name: string;
  quantity: number;
  min_threshold: number;
}

interface QualityCheck {
  id: number;
  component_id: number;
  component_name: string;
  inspection_point: string;
  status: 'pass' | 'fail';
  created_at: string;
  quantity: number;
}

interface QualityPattern {
  inspection_point: string;
  status: 'pass' | 'fail';
  count: number;
  date: string;
}

export class AutomationService {
  // Check inventory levels and generate alerts
  static async checkInventoryLevels(): Promise<InventoryItem[]> {
    const query = `
      SELECT * FROM inventory 
      WHERE quantity <= min_threshold 
      ORDER BY quantity ASC
    `;
    
    return new Promise((resolve, reject) => {
      db.all(query, [], (err, rows: InventoryItem[]) => {
        if (err) {
          console.error('Error checking inventory levels:', err);
          reject(err);
          return;
        }
        
        // Log low stock alerts
        rows.forEach(item => {
          const logQuery = `
            INSERT INTO system_logs (level, message, source)
            VALUES (?, ?, ?)
          `;
          
          db.run(logQuery, [
            'warning',
            `Low stock alert: ${item.component_name} (${item.quantity} remaining)`,
            'inventory'
          ]);
        });
        
        resolve(rows);
      });
    });
  }

  // Analyze quality check patterns
  static async analyzeQualityPatterns(): Promise<{ patterns: QualityPattern[], issues: QualityPattern[] }> {
    const query = `
      SELECT 
        inspection_point,
        status,
        COUNT(*) as count,
        strftime('%Y-%m-%d', created_at) as date
      FROM quality_checks
      GROUP BY inspection_point, status, date
      ORDER BY date DESC, count DESC
    `;
    
    return new Promise((resolve, reject) => {
      db.all(query, [], (err, rows: QualityPattern[]) => {
        if (err) {
          console.error('Error analyzing quality patterns:', err);
          reject(err);
          return;
        }
        
        // Identify potential issues
        const issues = rows.filter(row => 
          row.status === 'fail' && 
          row.count > 3 // More than 3 failures in a day
        );
        
        // Log potential issues
        issues.forEach(issue => {
          const logQuery = `
            INSERT INTO system_logs (level, message, source)
            VALUES (?, ?, ?)
          `;
          
          db.run(logQuery, [
            'warning',
            `Potential quality issue detected at ${issue.inspection_point}: ${issue.count} failures on ${issue.date}`,
            'quality'
          ]);
        });
        
        resolve({ patterns: rows, issues });
      });
    });
  }

  // Update inventory based on quality checks
  static async updateInventoryFromQualityChecks(): Promise<QualityCheck[]> {
    const query = `
      SELECT qc.*, i.component_name, i.quantity
      FROM quality_checks qc
      JOIN inventory i ON qc.component_id = i.id
      WHERE qc.status = 'fail'
      AND qc.created_at >= datetime('now', '-1 day')
    `;
    
    return new Promise((resolve, reject) => {
      db.all(query, [], (err, rows: QualityCheck[]) => {
        if (err) {
          console.error('Error updating inventory from quality checks:', err);
          reject(err);
          return;
        }
        
        // Update inventory quantities for failed components
        rows.forEach(row => {
          const updateQuery = `
            UPDATE inventory 
            SET quantity = quantity - 1,
                last_updated = CURRENT_TIMESTAMP
            WHERE id = ?
          `;
          
          db.run(updateQuery, [row.component_id], (err) => {
            if (err) {
              console.error('Error updating inventory:', err);
              return;
            }
            
            // Log the inventory update
            const logQuery = `
              INSERT INTO system_logs (level, message, source)
              VALUES (?, ?, ?)
            `;
            
            db.run(logQuery, [
              'info',
              `Inventory updated for ${row.component_name} due to quality check failure`,
              'inventory'
            ]);
          });
        });
        
        resolve(rows);
      });
    });
  }
} 