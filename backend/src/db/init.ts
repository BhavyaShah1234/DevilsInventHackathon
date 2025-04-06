import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';

const dbPath = path.join(__dirname, '../../database.sqlite');

// Remove existing database file if it exists
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
}

const db = new sqlite3.Database(dbPath, async (err) => {
  if (err) {
    console.error('Error initializing database:', err);
    process.exit(1);
  }
  console.log('Database initialized successfully');

  // Create users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create inventory table
  db.run(`
    CREATE TABLE IF NOT EXISTS inventory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      min_threshold INTEGER NOT NULL,
      max_threshold INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create system_logs table
  db.run(`
    CREATE TABLE IF NOT EXISTS system_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      level TEXT NOT NULL,
      message TEXT NOT NULL,
      source TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create quality_checks table
  db.run(`
    CREATE TABLE IF NOT EXISTS quality_checks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      component_id INTEGER NOT NULL,
      inspection_point_id INTEGER NOT NULL,
      status TEXT NOT NULL,
      notes TEXT,
      inspector_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (inspector_id) REFERENCES users(id),
      FOREIGN KEY (component_id) REFERENCES inventory(id),
      FOREIGN KEY (inspection_point_id) REFERENCES inspection_points(id)
    )
  `);

  // Insert test user
  const testUserPassword = 'Test123!';
  const hashedPassword = await bcrypt.hash(testUserPassword, 10);
  db.run(
    'INSERT OR IGNORE INTO users (email, password, role) VALUES (?, ?, ?)',
    ['user2@devilsinvent.com', hashedPassword, 'user']
  );

  db.close();
}); 