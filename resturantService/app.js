const express = require('express');
const mongoose = require('mongoose');

// Import Routes
const restaurantRoutes = require('./routes/restaurantRoutes');
const categoryItemRoutes = require('./routes/categoryItemRoutes');
const itemRoutes = require('./routes/itemRoutes');

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/foodDelivery', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => console.log('Database connected'))
  .catch(err => console.error('Database connection error:', err));

// Use Routes
app.use('/restaurants', restaurantRoutes); // Routes for restaurant operations
app.use('/categoryItems', categoryItemRoutes); // Routes for category management
app.use('/items', itemRoutes); // Routes for item management

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
