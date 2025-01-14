const Restaurant = require('../models/restaurant');

// Add a new restaurant
const addRestaurant = async (restaurantData) => {
    if (!restaurantData.type) {
        throw new Error('Restaurant type is required');
    }
    const restaurant = new Restaurant(restaurantData);
    return await restaurant.save();
};

// Delete a restaurant by ID
const deleteRestaurant = async (restaurantId) => {
    return await Restaurant.findByIdAndDelete(restaurantId);
};

// View details of a specific restaurant
const getRestaurantDetails = async (restaurantId) => {
    return await Restaurant.findById(restaurantId)
        .populate('menu'); // Populate menu with CategoryItem documents
};


// Update restaurant details
const updateRestaurantDetails = async (restaurantId, updates) => {
    if (updates.type && !['Italian', 'Pizza', 'Fast Food', 'Chinese', 'Indian', 'Dessert', 'Cafe'].includes(updates.type)) {
        throw new Error('Invalid restaurant type');
    }
    return await Restaurant.findByIdAndUpdate(restaurantId, updates, { new: true });
};

// View menu based on filters (location and type)
const getFilteredMenu = async (filters) => {
    const { location, type } = filters;

    // Build query
    const query = {};
    if (location) {
        query['address.city'] = location;
    }
    if (type) {
        query['type'] = type;
    }

    const restaurants = await Restaurant.find(query).populate({
        path: 'menu',
        populate: { path: 'category' }
    });

    return restaurants.map((restaurant) => ({
        restaurant: restaurant.name,
        menu: restaurant.menu
    }));
};

module.exports = {
    addRestaurant,
    deleteRestaurant,
    getRestaurantDetails,
    updateRestaurantDetails,
    getFilteredMenu
};
