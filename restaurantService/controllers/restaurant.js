const restaurantService = require('../services/restaurant');

const addRestaurant = async (req, res) => {
    try {
        const restaurantData = req.body;
        const newRestaurant = await restaurantService.addRestaurant(restaurantData);
        res.status(201).json(newRestaurant);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteRestaurant = async (req, res) => {
    try {
        const { id } = req.params;
        await restaurantService.deleteRestaurant(id);
        res.status(204).end();
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

const getRestaurantDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const restaurant = await restaurantService.getRestaurantDetails(id);
        res.status(200).json(restaurant);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

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

const getFilteredMenu = async (req, res) => {
    try {
        const { location, type } = req.body;
        const filteredMenu = await restaurantService.getFilteredMenu({ location, type });
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
