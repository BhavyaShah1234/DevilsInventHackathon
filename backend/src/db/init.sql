-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create system logs table
CREATE TABLE IF NOT EXISTS system_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    level TEXT NOT NULL,  -- 'info', 'warning', 'error'
    message TEXT NOT NULL,
    source TEXT NOT NULL, -- component that generated the log
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create inventory table
CREATE TABLE IF NOT EXISTS inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    component_name TEXT NOT NULL,
    description TEXT,
    quantity INTEGER NOT NULL DEFAULT 0,
    min_threshold INTEGER NOT NULL DEFAULT 10,
    location TEXT,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INTEGER,
    FOREIGN KEY (updated_by) REFERENCES users(id)
);

-- Create quality checks table
CREATE TABLE IF NOT EXISTS quality_checks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    inspection_point TEXT NOT NULL,
    status TEXT NOT NULL, -- 'pass', 'fail', 'pending'
    notes TEXT,
    inspector_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (inspector_id) REFERENCES users(id)
);

-- Create robot paths table
CREATE TABLE IF NOT EXISTS robot_paths (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    path_name TEXT NOT NULL,
    path_points TEXT NOT NULL, -- JSON array of coordinates
    distance REAL NOT NULL,
    estimated_time INTEGER NOT NULL, -- in seconds
    energy_usage REAL NOT NULL, -- estimated energy consumption
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'failed'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    created_by INTEGER,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Create inspection points table
CREATE TABLE IF NOT EXISTS inspection_points (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    x_coordinate REAL NOT NULL,
    y_coordinate REAL NOT NULL,
    description TEXT,
    priority INTEGER DEFAULT 1, -- 1 (lowest) to 5 (highest)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 