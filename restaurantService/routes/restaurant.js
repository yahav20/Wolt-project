const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurant');

// Add a new restaurant
router.post('/', restaurantController.addRestaurant);

// Route to get all restaurants without menu
router.get('/', restaurantController.getAllRestaurantsWithoutMenu);

// Delete a restaurant by ID
router.delete('/:id', restaurantController.deleteRestaurant);

// Get details of a specific restaurant
router.get('/:id', restaurantController.getRestaurantDetails);

// Update restaurant details
router.put('/:id', restaurantController.updateRestaurantDetails);

// Get menu based on filters (location and type)
router.post('/menu/filtered', restaurantController.getFilteredMenu);


module.exports = router;
