const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const FILE_PATH = path.join(__dirname, '../data/inventory_items.json');

// GET all inventory items
router.get('/', (req, res) => {
  const data = JSON.parse(fs.readFileSync(FILE_PATH, 'utf-8'));
  res.json(data);
});

// POST a new inventory item
router.post('/', (req, res) => {
  const { name, quantity, status, lastUpdated, robotName } = req.body;

  if (!name || quantity == null || !status || !lastUpdated || !robotName) {
    return res.status(400).json({ error: 'Missing inventory item fields' });
  }

  const items = JSON.parse(fs.readFileSync(FILE_PATH, 'utf-8'));
  const maxId = items.reduce((max, item) => Math.max(max, item.id), 0);
  const newId = maxId + 1;

  const newItem = {
    id: newId,
    name,
    quantity,
    status,
    lastUpdated,
    robotName
  };

  items.push(newItem);
  fs.writeFileSync(FILE_PATH, JSON.stringify(items, null, 2));

  res.status(201).json(newItem);
});

module.exports = router;
