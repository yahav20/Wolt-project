const Restaurant = require('../models/restaurant');
const CategoryItem = require('../models/categoryItem'); // Ensure the path is correct

// Add a new restaurant with menu
const addRestaurant = async (restaurantData) => {
    try {
        // Validate required fields
        const requiredFields = ['name', 'type', 'address', 'phone', 'openingHours'];
        requiredFields.forEach((field) => {
            if (!restaurantData[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        });

        // Step 1: Create the restaurant without the menu
        const restaurant = new Restaurant({ ...restaurantData, menu: [] });
        const savedRestaurant = await restaurant.save();

        // Step 2: Validate and create menu categories
        let menuIds = [];
        if (restaurantData.menu && Array.isArray(restaurantData.menu)) {
            menuIds = await Promise.all(
                restaurantData.menu.map(async (category) => {
                    // Add the restaurant ID to each category
                    const newCategoryItem = new CategoryItem({
                        ...category,
                        restaurant: savedRestaurant._id
                    });
                    const savedCategory = await newCategoryItem.save();
                    return savedCategory._id;
                })
            );
        }

        // Step 3: Update the restaurant with the created menu IDs
        savedRestaurant.menu = menuIds;
        await savedRestaurant.save();

        return savedRestaurant;
    } catch (error) {
        console.error('Error in addRestaurant:', error.message);
        throw error;
    }
};

// Delete a restaurant by ID
const deleteRestaurant = async (restaurantId) => {
    try {
        if (!restaurantId) {
            throw new Error('Restaurant ID is required.');
        }

        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            throw new Error('Restaurant not found.');
        }

        if (restaurant.menu && restaurant.menu.length > 0) {
            await CategoryItem.deleteMany({ _id: { $in: restaurant.menu } });
        }

        return await Restaurant.findByIdAndDelete(restaurantId);
    } catch (error) {
        console.error('Error in deleteRestaurant:', error.message);
        throw error;
    }
};

// View details of a specific restaurant
const getRestaurantDetails = async (restaurantId) => {
    try {
        if (!restaurantId) {
            throw new Error('Restaurant ID is required.');
        }

        const restaurant = await Restaurant.findById(restaurantId).populate('menu');
        if (!restaurant) {
            throw new Error('Restaurant not found.');
        }

        return restaurant;
    } catch (error) {
        console.error('Error in getRestaurantDetails:', error.message);
        throw error;
    }
};

// Update restaurant details
const updateRestaurantDetails = async (restaurantId, updates) => {
    try {
        if (!restaurantId) {
            throw new Error('Restaurant ID is required.');
        }

        if (updates.type && !['Italian', 'Pizza', 'Fast Food', 'Chinese', 'Indian', 'Dessert', 'Cafe'].includes(updates.type)) {
            throw new Error('Invalid restaurant type.');
        }

        const updatedRestaurant = await Restaurant.findByIdAndUpdate(restaurantId, updates, { new: true });
        if (!updatedRestaurant) {
            throw new Error('Restaurant not found.');
        }

        return updatedRestaurant;
    } catch (error) {
        console.error('Error in updateRestaurantDetails:', error.message);
        throw error;
    }
};

// View menu based on filters
const getFilteredMenu = async (filters) => {
    try {
        const { location, type } = filters;
        if (!location && !type) {
            throw new Error('At least one filter (location or type) is required.');
        }

        const query = {};
        if (location) query['address.city'] = location;
        if (type) query['type'] = type;

        const restaurants = await Restaurant.find(query).populate({
            path: 'menu',
            populate: { path: 'items' }
        });

        if (!restaurants || restaurants.length === 0) {
            throw new Error('No restaurants found matching the provided filters.');
        }

        return restaurants.map((restaurant) => ({
            restaurant: restaurant.name,
            menu: restaurant.menu
        }));
    } catch (error) {
        console.error('Error in getFilteredMenu:', error.message);
        throw error;
    }
};
const getAllRestaurantsWithoutMenu = async () => {
    try {
        // Fetch all restaurants and exclude the "menu" field
        const restaurants = await Restaurant.find({}, '-menu');
        return restaurants;
    } catch (error) {
        console.error('Error in getAllRestaurantsWithoutMenu:', error.message);
        throw error;
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
