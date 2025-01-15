const restaurantService = require('../services/restaurant');

const addRestaurant = async (req, res) => {
    try {
        const { menu, ...restaurantData } = req.body; // Extract menu from the request body

        let menuIds = [];
        if (menu && Array.isArray(menu)) {
            // Create CategoryItem documents for the provided menu
            menuIds = await Promise.all(
                menu.map(async (category) => {
                    const categoryItem = new CategoryItem(category); // Create a new CategoryItem
                    await categoryItem.save(); // Save it to the database
                    return categoryItem._id; // Return its ID
                })
            );
        }

        // Add the restaurant with the created menu IDs
        const restaurant = await restaurantService.addRestaurant({
            ...restaurantData,
            menu: menuIds
        });

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
