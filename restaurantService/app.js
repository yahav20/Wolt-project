const express = require('express');
const mongoose = require('mongoose');
require('custom-env').env(process.env.NODE_ENV,"./config"); // or require('custom-env').env('production');

// Import Routes
const restaurantRoutes = require('./routes/restaurant');
const categoryItemRoutes = require('./routes/categoryItem');
const itemRoutes = require('./routes/item');

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant-service');


// Use Routes
app.use('/restaurants', restaurantRoutes); // Routes for restaurant operations
app.use('/categoryItems', categoryItemRoutes); // Routes for category management
app.use('/items', itemRoutes); // Routes for item management

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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));