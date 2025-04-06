import { AutomationService } from './automation';
import { Database } from 'sqlite3';
import path from 'path';

const db = new Database(path.join(__dirname, '../../database.sqlite'));

export class SchedulerService {
  private static checkInterval = 5 * 60 * 1000; // 5 minutes
  private static timer: NodeJS.Timeout | null = null;

  static start() {
    if (this.timer) {
      console.log('Scheduler already running');
      return;
    }

    console.log('Starting scheduler...');
    
    // Run initial checks
    this.runChecks();
    
    // Schedule periodic checks
    this.timer = setInterval(() => {
      this.runChecks();
    }, this.checkInterval);
  }

  static stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      console.log('Scheduler stopped');
    }
  }

  private static async runChecks() {
    try {
      console.log('Running automated checks...');
      
      // Check inventory levels
      const lowStockItems = await AutomationService.checkInventoryLevels();
      if (lowStockItems.length > 0) {
        console.log(`Found ${lowStockItems.length} items with low stock`);
      }
      
      // Analyze quality patterns
      const { patterns, issues } = await AutomationService.analyzeQualityPatterns();
      if (issues.length > 0) {
        console.log(`Found ${issues.length} potential quality issues`);
      }
      
      // Update inventory based on quality checks
      const updatedItems = await AutomationService.updateInventoryFromQualityChecks();
      if (updatedItems.length > 0) {
        console.log(`Updated ${updatedItems.length} inventory items based on quality checks`);
      }
      
      // Log successful run
      const logQuery = `
        INSERT INTO system_logs (level, message, source)
        VALUES (?, ?, ?)
      `;
      
      db.run(logQuery, [
        'info',
        'Automated checks completed successfully',
        'scheduler'
      ]);
      
    } catch (error) {
      console.error('Error running automated checks:', error);
      
      // Log error
      const logQuery = `
        INSERT INTO system_logs (level, message, source)
        VALUES (?, ?, ?)
      `;
      
      db.run(logQuery, [
        'error',
        `Error running automated checks: ${error}`,
        'scheduler'
      ]);
    }
  }
} 