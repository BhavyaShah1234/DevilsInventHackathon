import { Database } from 'sqlite3';
import { readFileSync } from 'fs';
import { join } from 'path';

const dbPath = join(__dirname, '../../database.sqlite');
const db = new Database(dbPath);

const schema = readFileSync(join(__dirname, 'init.sql'), 'utf8');

db.serialize(() => {
  // Split schema into individual statements and execute them
  schema.split(';').filter(stmt => stmt.trim()).forEach(stmt => {
    db.run(stmt, (err) => {
      if (err) {
        console.error('Error executing schema:', err);
        process.exit(1);
      }
    });
  });
  console.log('Database tables created successfully');
});

export default db; 