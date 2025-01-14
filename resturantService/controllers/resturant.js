const restaurantService = require('../services/restaurantService');

// Add a new restaurant
const addRestaurant = async (req, res) => {
    try {
        const restaurant = await restaurantService.addRestaurant(req.body);
        res.status(201).json(restaurant);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a restaurant by ID
const deleteRestaurant = async (req, res) => {
    try {
        await restaurantService.deleteRestaurant(req.params.id);
        res.status(204).end();
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

// View details of a specific restaurant
const getRestaurantDetails = async (req, res) => {
    try {
        const restaurant = await restaurantService.getRestaurantDetails(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }
        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update restaurant details
const updateRestaurantDetails = async (req, res) => {
    try {
        const updatedRestaurant = await restaurantService.updateRestaurantDetails(req.params.id, req.body);
        res.json(updatedRestaurant);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// View menu based on filters (location and type)
const getFilteredMenu = async (req, res) => {
    try {
        const filters = req.query; // e.g., ?location=Tel%20Aviv&type=Pizza
        const filteredMenu = await restaurantService.getFilteredMenu(filters);
        res.json(filteredMenu);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    addRestaurant,
    deleteRestaurant,
    getRestaurantDetails,
    updateRestaurantDetails,
    getFilteredMenu
};
