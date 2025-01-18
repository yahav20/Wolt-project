const categoryItemService = require('../services/categoryItem');

// Add a new category to the menu
const addCategoryToMenu = async (req, res) => {
    try {
        const { restaurantId } = req.params; // Extract restaurant ID from params
        const categoryData = req.body; // Extract category data from request body

        // Call the service to add a category
        const category = await categoryItemService.addCategoryToMenu(restaurantId, categoryData);
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a category from the menu
const deleteCategoryFromMenu = async (req, res) => {
    try {
        const { restaurantId, categoryId } = req.params; // Extract restaurant and category IDs from params

        // Call the service to delete the category
        await categoryItemService.deleteCategoryFromMenu(restaurantId, categoryId);
        res.status(204).end(); // Respond with no content
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

// Get all categories for a specific restaurant
const getCategoriesForRestaurant = async (req, res) => {
    try {
        const { restaurantId } = req.params; // Extract restaurant ID from params

        // Call the service to get categories
        const categories = await categoryItemService.getCategoriesForRestaurant(restaurantId);
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    addCategoryToMenu,
    deleteCategoryFromMenu,
    getCategoriesForRestaurant
};
