const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Path to log file
const LOG_FILE = path.join(__dirname, '../logs/inventory_logs.json');

// GET /api/logs - Get all log entries
router.get('/', (req, res) => {
  const logs = JSON.parse(fs.readFileSync(LOG_FILE, 'utf-8'));
  res.json(logs);
});

// POST /api/logs - Add a new log entry
router.post('/', (req, res) => {
    const { message } = req.body;
  
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
  
    const newLog = {
      message,
      timestamp: new Date().toISOString()
    };
  
    const logs = JSON.parse(fs.readFileSync(LOG_FILE, 'utf-8'));
    logs.unshift(newLog);
    fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
  
    res.status(201).json(newLog);
  });
  

module.exports = router;
