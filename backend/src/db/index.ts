import sqlite3 from 'sqlite3';
import { initializeDatabase } from './init';

const db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase(db);
  }
});

export default db; 