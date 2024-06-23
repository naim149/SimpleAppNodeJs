const express = require('express');
const path = require('path');
const { optimizeAllocation } = require('./optimization');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Endpoint to handle optimization
app.post('/api/optimize', (req, res) => {
  const optimizationInstance = req.body;
  const result = optimizeAllocation(optimizationInstance);
  res.json(result);
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
