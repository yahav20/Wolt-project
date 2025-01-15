const restaurantService = require('../services/restaurant');

// Add a new restaurant with menu
const addRestaurant = async (req, res) => {
    try {
        const restaurantData = req.body;
        const newRestaurant = await restaurantService.addRestaurant(restaurantData);
        res.status(201).json(newRestaurant);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a restaurant by ID
const deleteRestaurant = async (req, res) => {
    try {
        const { id } = req.params;
        await restaurantService.deleteRestaurant(id);
        res.status(204).end(); // No content
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

// Get details of a specific restaurant
const getRestaurantDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const restaurant = await restaurantService.getRestaurantDetails(id);
        res.status(200).json(restaurant);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

// Update restaurant details
const updateRestaurantDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updatedRestaurant = await restaurantService.updateRestaurantDetails(id, updates);
        res.status(200).json(updatedRestaurant);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get filtered menu based on location and type
const getFilteredMenu = async (req, res) => {
    try {
        const filters = req.query; // Get filters from query parameters
        const filteredMenu = await restaurantService.getFilteredMenu(filters);
        res.status(200).json(filteredMenu);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
const getAllRestaurantsWithoutMenu = async (req, res) => {
    try {
        const restaurants = await restaurantService.getAllRestaurantsWithoutMenu();
        res.status(200).json(restaurants);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    addRestaurant,
    deleteRestaurant,
    getRestaurantDetails,
    updateRestaurantDetails,
    getFilteredMenu,
    getAllRestaurantsWithoutMenu 
};
