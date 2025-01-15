const Restaurant = require('../models/restaurant');
const CategoryItem = require('../models/categoryItem'); // Ensure the path is correct

// Helper function to format restaurant data consistently
const formatRestaurant = (restaurant) => ({
    _id: restaurant._id,
    name: restaurant.name,
    type: restaurant.type,
    address: {
        street: restaurant.address.street,
        city: restaurant.address.city,
        state: restaurant.address.state,
        zipCode: restaurant.address.zipCode
    },
    phone: restaurant.phone,
    email: restaurant.email || null,
    website: restaurant.website || null,
    openingHours: restaurant.openingHours,
    menu: restaurant.menu || [],
    createdAt: restaurant.createdAt,
    updatedAt: restaurant.updatedAt
});

// Add a new restaurant with menu
const addRestaurant = async (restaurantData) => {
    const requiredFields = ['name', 'type', 'address', 'phone', 'openingHours'];
    requiredFields.forEach((field) => {
        if (!restaurantData[field]) {
            throw new Error(`Missing required field: ${field}`);
        }
    });

    const restaurant = new Restaurant({ ...restaurantData, menu: [] });
    const savedRestaurant = await restaurant.save();

    let menuIds = [];
    if (restaurantData.menu && Array.isArray(restaurantData.menu)) {
        menuIds = await Promise.all(
            restaurantData.menu.map(async (category) => {
                const newCategoryItem = new CategoryItem({
                    ...category,
                    restaurant: savedRestaurant._id
                });
                const savedCategory = await newCategoryItem.save();
                return savedCategory._id;
            })
        );
    }

    savedRestaurant.menu = menuIds;
    await savedRestaurant.save();
    return formatRestaurant(savedRestaurant);
};

// Delete a restaurant by ID
const deleteRestaurant = async (restaurantId) => {
    if (!restaurantId) throw new Error('Restaurant ID is required.');

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) throw new Error('Restaurant not found.');

    if (restaurant.menu && restaurant.menu.length > 0) {
        await CategoryItem.deleteMany({ _id: { $in: restaurant.menu } });
    }

    return await Restaurant.findByIdAndDelete(restaurantId);
};

// View details of a specific restaurant
const getRestaurantDetails = async (restaurantId) => {
    if (!restaurantId) throw new Error('Restaurant ID is required.');

    const restaurant = await Restaurant.findById(restaurantId).populate('menu');
    if (!restaurant) throw new Error('Restaurant not found.');

    return formatRestaurant(restaurant);
};

// Update restaurant details
const updateRestaurantDetails = async (restaurantId, updates) => {
    if (!restaurantId) throw new Error('Restaurant ID is required.');

    if (
        updates.type &&
        !['Italian', 'Pizza', 'Fast Food', 'Chinese', 'Indian', 'Dessert', 'Cafe'].includes(updates.type)
    ) {
        throw new Error('Invalid restaurant type.');
    }

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(restaurantId, updates, {
        new: true
    });
    if (!updatedRestaurant) throw new Error('Restaurant not found.');

    return formatRestaurant(updatedRestaurant);
};

// View menu based on filters (location and type)
const getFilteredMenu = async (filters) => {
    const { location, type } = filters;

    if (!location && !type) throw new Error('At least one filter (location or type) is required.');

    const query = {};
    if (location) query['address.city'] = location;
    if (type) query['type'] = type;

    const restaurants = await Restaurant.find(query).populate({
        path: 'menu',
        populate: { path: 'items' }
    });

    if (!restaurants || restaurants.length === 0) throw new Error('No restaurants found matching the provided filters.');

    return restaurants.map((restaurant) => ({
        restaurant: restaurant.name,
        menu: restaurant.menu
    }));
};

// Get all restaurants without menu
const getAllRestaurantsWithoutMenu = async () => {
    const restaurants = await Restaurant.find({}, '-menu');
    return restaurants.map(formatRestaurant);
};

module.exports = {
    addRestaurant,
    deleteRestaurant,
    getRestaurantDetails,
    updateRestaurantDetails,
    getFilteredMenu,
    getAllRestaurantsWithoutMenu
};
