import { Database } from 'sqlite3';
import bcrypt from 'bcryptjs';
import { join } from 'path';

const dbPath = join(__dirname, '../../database.sqlite');
const db = new Database(dbPath);

async function createAdminUser() {
  const email = 'admin@example.com';
  const password = 'admin123';
  const role = 'super-admin';
  const permissions = ['all'];

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.run(
      'INSERT OR IGNORE INTO users (email, password, role, permissions) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, role, JSON.stringify(permissions)],
      function(err) {
        if (err) {
          console.error('Error creating admin user:', err);
          process.exit(1);
        }
        
        if (this.changes === 0) {
          console.log('Admin user already exists');
        } else {
          console.log('Admin user created successfully');
          console.log('Email:', email);
          console.log('Password:', password);
        }
        
        db.close();
        process.exit(0);
      }
    );
  } catch (err) {
    console.error('Error creating admin user:', err);
    process.exit(1);
  }
}

createAdminUser(); 