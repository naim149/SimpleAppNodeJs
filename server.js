require('dotenv').config();
const express = require('express');
const path = require('path');
const { optimizeAllocation } = require('./optimization');
const app = express();
const port = process.env.PORT || 3001;
const cors = require('cors');

// Middleware
app.use(express.json());

// Enable CORS
app.use(cors());

app.use(express.static(path.join(__dirname, 'client', 'build')));

// Endpoint to handle optimization
app.post('/api/optimize', (req, res) => {
  const optimizationInstance = req.body;
  const result = optimizeAllocation(optimizationInstance);
  res.json(result);
});

app.get('/api', (req, res) => {
  res.send({ message: 'Hello from server!' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
