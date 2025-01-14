const categoryItemService = require('../services/categoryItem');

// Add a new category to the menu
const addCategoryToMenu = async (req, res) => {
    try {
        const category = await categoryItemService.addCategoryToMenu(req.params.restaurantId, req.body);
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a category from the menu
const deleteCategoryFromMenu = async (req, res) => {
    try {
        await categoryItemService.deleteCategoryFromMenu(req.params.restaurantId, req.params.categoryId);
        res.status(204).end();
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

// Get all categories for a specific restaurant
const getCategoriesForRestaurant = async (req, res) => {
    try {
        const categories = await categoryItemService.getCategoriesForRestaurant(req.params.restaurantId);
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    addCategoryToMenu,
    deleteCategoryFromMenu,
    getCategoriesForRestaurant
};
