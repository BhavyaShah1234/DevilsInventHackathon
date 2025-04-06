import { Database } from 'sqlite3';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(__dirname, '../../database.sqlite');
const schemaPath = path.join(__dirname, 'init.sql');

// Create database connection
const db = new Database(dbPath);

// Read and execute schema
const schema = fs.readFileSync(schemaPath, 'utf8');
db.exec(schema, (err) => {
  if (err) {
    console.error('Error initializing database:', err);
    process.exit(1);
  }
  console.log('Database initialized successfully');
  db.close();
}); 