const Restaurant = require('../models/restaurant');
const CategoryItem = require('../models/categoryItem'); // Import the CategoryItem model

// Add a new restaurant with menu
const addRestaurant = async (restaurantData) => {
    // Check if required fields are provided
    const requiredFields = ['name', 'type', 'address', 'phone', 'openingHours'];
    requiredFields.forEach((field) => {
        if (!restaurantData[field]) {
            throw new Error(`Missing required field: ${field}`);
        }
    });

    // Validate restaurant name
    if (typeof restaurantData.name !== 'string' || restaurantData.name.trim().length < 3) {
        throw new Error('Restaurant name must be a string and at least 3 characters long.');
    }

    // Validate type
    const allowedTypes = ['Italian', 'Pizza', 'Fast Food', 'Chinese', 'Indian', 'Dessert', 'Cafe'];
    if (!allowedTypes.includes(restaurantData.type)) {
        throw new Error(`Invalid restaurant type. Allowed types: ${allowedTypes.join(', ')}`);
    }

    // Validate address
    const { address } = restaurantData;
    if (
        !address.street ||
        typeof address.street !== 'string' ||
        address.street.trim().length < 3
    ) {
        throw new Error('Address street must be a string and at least 3 characters long.');
    }
    if (!address.city || typeof address.city !== 'string' || address.city.trim().length < 2) {
        throw new Error('Address city must be a string and at least 2 characters long.');
    }
    if (!address.state || typeof address.state !== 'string' || address.state.trim().length < 2) {
        throw new Error('Address state must be a string and at least 2 characters long.');
    }
    if (!address.zipCode || !/^\d{5}$/.test(address.zipCode)) {
        throw new Error('Address zip code must be a 5-digit number.');
    }

    // Validate phone
    if (!/^\d{10}$/.test(restaurantData.phone)) {
        throw new Error('Phone number must be a 10-digit number.');
    }

    // Validate opening hours
    const daysOfWeek = [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday'
    ];
    const { openingHours } = restaurantData;
    daysOfWeek.forEach((day) => {
        if (!openingHours[day] || !openingHours[day].open || !openingHours[day].close) {
            throw new Error(`Opening hours for ${day} must include both "open" and "close" times.`);
        }
        if (
            !/^\d{2}:\d{2}$/.test(openingHours[day].open) ||
            !/^\d{2}:\d{2}$/.test(openingHours[day].close)
        ) {
            throw new Error(
                `Opening and closing times for ${day} must be in the format "HH:mm".`
            );
        }
    });

    // Check if name already exists
    const existingRestaurant = await Restaurant.findOne({ name: restaurantData.name });
    if (existingRestaurant) {
        throw new Error(`A restaurant with the name "${restaurantData.name}" already exists.`);
    }

    // Check if menu exists in the request
    let menuIds = [];
    if (restaurantData.menu && Array.isArray(restaurantData.menu)) {
        // Validate each menu category
        restaurantData.menu.forEach((category) => {
            if (!category.name || typeof category.name !== 'string') {
                throw new Error('Each menu category must have a valid name.');
            }
            if (!Array.isArray(category.items)) {
                throw new Error('Each menu category must include an array of items.');
            }
        });

        // Create CategoryItem documents and collect their IDs
        const createdMenu = await Promise.all(
            restaurantData.menu.map(async (category) => {
                const newCategoryItem = new CategoryItem(category);
                await newCategoryItem.save();
                return newCategoryItem._id;
            })
        );
        menuIds = createdMenu;
    }

    // Create the restaurant with the menu IDs
    const restaurant = new Restaurant({
        ...restaurantData,
        menu: menuIds
    });

    return await restaurant.save();
};

const deleteRestaurant = async (restaurantId) => {
    // Validate restaurant ID
    if (!restaurantId) {
        throw new Error('Restaurant ID is required.');
    }

    // Find the restaurant
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
        throw new Error('Restaurant not found.');
    }

    // Delete all CategoryItems associated with the restaurant
    if (restaurant.menu && restaurant.menu.length > 0) {
        await CategoryItem.deleteMany({ _id: { $in: restaurant.menu } });
    }

    // Delete the restaurant
    return await Restaurant.findByIdAndDelete(restaurantId);
};


// View details of a specific restaurant
const getRestaurantDetails = async (restaurantId) => {
    // Validate restaurant ID
    if (!restaurantId) {
        throw new Error('Restaurant ID is required.');
    }

    const restaurant = await Restaurant.findById(restaurantId).populate('menu'); // Populate menu with CategoryItem documents
    if (!restaurant) {
        throw new Error('Restaurant not found.');
    }

    return restaurant;
};

// Update restaurant details
const updateRestaurantDetails = async (restaurantId, updates) => {
    // Validate restaurant ID
    if (!restaurantId) {
        throw new Error('Restaurant ID is required.');
    }

    // Check for valid type, if provided
    if (updates.type && !['Italian', 'Pizza', 'Fast Food', 'Chinese', 'Indian', 'Dessert', 'Cafe'].includes(updates.type)) {
        throw new Error('Invalid restaurant type.');
    }

    // Check if the name is being updated to a duplicate
    if (updates.name) {
        const existingRestaurant = await Restaurant.findOne({ name: updates.name });
        if (existingRestaurant && existingRestaurant._id.toString() !== restaurantId) {
            throw new Error(`A restaurant with the name "${updates.name}" already exists.`);
        }
    }

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(restaurantId, updates, { new: true });
    if (!updatedRestaurant) {
        throw new Error('Restaurant not found.');
    }

    return updatedRestaurant;
};

// View menu based on filters (location and type)
const getFilteredMenu = async (filters) => {
    const { location, type } = filters;

    // Validate filters
    if (!location && !type) {
        throw new Error('At least one filter (location or type) is required.');
    }

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
        populate: { path: 'items' }
    });

    if (restaurants.length === 0) {
        throw new Error('No restaurants found matching the provided filters.');
    }

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
