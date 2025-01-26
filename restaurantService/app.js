const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan'); // Import morgan
require('custom-env').env(process.env.NODE_ENV, '../config');
const cors = require('cors');
// Import Routes
const restaurantRoutes = require('./routes/restaurant');
const categoryItemRoutes = require('./routes/categoryItem');
const itemRoutes = require('./routes/item');

const app = express();
app.use(express.json());
app.use(morgan('combined')); // Use morgan for logging
// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/woltTest')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Use Routes
app.use(cors());
app.use('/api/restaurants', restaurantRoutes); // Routes for restaurant operations
app.use('/api/categoryItems', categoryItemRoutes); // Routes for category management
app.use('/api/item', itemRoutes); // Routes for item management

// Handle unknown routes
app.use((req, res, next) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
const PORT = process.env.RESTAURANT_PORT || 3000; // Default to 3000 if not set
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
