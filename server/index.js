const express = require('express');
const cors = require('cors');
require('dotenv').config();
const routes = require('./routes/routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('📊 Welcome to the PEARL API - Target Planning & Tracking System');
});

app.use('/api', routes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: '🔍 API route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});