const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); // <- allows cross-origin requests (important!)
app.use(express.json()); // <- allows JSON body parsing

const logRoutes = require('./routes/logRoutes');
app.use('/api/logs', logRoutes);

const itemRoutes = require('./routes/itemRoutes');
app.use('/api/items', itemRoutes);

// Start the server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
