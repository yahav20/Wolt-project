const CategoryItem = require('../models/categoryItem');
const Restaurant = require('../models/restaurant');

// Add a new category to the menu
const addCategoryToMenu = async (restaurantId, categoryData) => {
    // Validate restaurantId
    if (!restaurantId) throw new Error('Restaurant ID is required');

    // Validate categoryData
    const { name, items } = categoryData;
    if (!name || typeof name !== 'string' || name.trim().length < 3) {
        throw new Error('Category name must be a string and at least 3 characters long.');
    }

    if (items && !Array.isArray(items)) {
        throw new Error('Items must be an array.');
    }

    // Validate items if provided
    if (items) {
        items.forEach((item, index) => {
            if (!item.name || typeof item.name !== 'string' || item.name.trim().length < 2) {
                throw new Error(`Item at index ${index} must have a valid name (at least 2 characters).`);
            }
            if (typeof item.price !== 'number' || item.price <= 0) {
                throw new Error(`Item at index ${index} must have a positive price.`);
            }
            if (item.description && typeof item.description !== 'string') {
                throw new Error(`Item description at index ${index} must be a string.`);
            }
            if (item.imageUrl && !/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(item.imageUrl)) {
                throw new Error(`Item image URL at index ${index} must be a valid URL.`);
            }
            if (item.availability && typeof item.availability !== 'boolean') {
                throw new Error(`Item availability at index ${index} must be a boolean value.`);
            }
        });
    }

    // Create and save the category
    const category = new CategoryItem(categoryData);
    const savedCategory = await category.save();

    // Find the restaurant and add the category to its menu
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) throw new Error('Restaurant not found');

    restaurant.menu.push(savedCategory._id);
    await restaurant.save();

    return savedCategory;
};

// Delete a category from the menu
const deleteCategoryFromMenu = async (restaurantId, categoryId) => {
    // Validate restaurantId and categoryId
    if (!restaurantId) throw new Error('Restaurant ID is required');
    if (!categoryId) throw new Error('Category ID is required');

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) throw new Error('Restaurant not found');

    // Check if the category exists in the restaurant's menu
    const categoryExists = restaurant.menu.some(
        (menuCategoryId) => menuCategoryId.toString() === categoryId
    );
    if (!categoryExists) throw new Error('Category not found in the restaurant menu');

    // Remove the category from the restaurant's menu
    restaurant.menu = restaurant.menu.filter(
        (menuCategoryId) => menuCategoryId.toString() !== categoryId
    );
    await restaurant.save();

    // Delete the category from the database
    return await CategoryItem.findByIdAndDelete(categoryId);
};

// Get all categories for a specific restaurant
const getCategoriesForRestaurant = async (restaurantId) => {
    // Validate restaurantId
    if (!restaurantId) throw new Error('Restaurant ID is required');

    const restaurant = await Restaurant.findById(restaurantId).populate('menu');
    if (!restaurant) throw new Error('Restaurant not found');

    return restaurant.menu;
};

module.exports = {
    addCategoryToMenu,
    deleteCategoryFromMenu,
    getCategoriesForRestaurant
};
