DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  permissions TEXT NOT NULL DEFAULT '["read"]',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create initial admin user with password 'admin123'
INSERT OR IGNORE INTO users (email, password, role, permissions) 
VALUES (
  'admin@example.com',
  '$2a$10$rQJrYs7nk.TKIfYq0LXn8.k6h0xRBI3o1izQcmxGCYqYJh4Thh0Uy',
  'super-admin',
  '["all"]'
);

-- Create initial normal user with hashed password 'user123'
INSERT OR IGNORE INTO users (email, password, role, permissions) 
VALUES (
  'user@example.com',
  '$2a$10$rQJrYs7nk.TKIfYq0LXn8.k6h0xRBI3o1izQcmxGCYqYJh4Thh0Uy',
  'user',
  '["read"]'
); 