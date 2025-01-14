const CategoryItem = require('../models/categoryItem');
const Restaurant = require('../models/restaurant');

// Add a new category to the menu
const addCategoryToMenu = async (restaurantId, categoryData) => {
    const category = new CategoryItem(categoryData);
    const savedCategory = await category.save();

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) throw new Error('Restaurant not found');

    restaurant.menu.push(savedCategory._id);
    await restaurant.save();

    return savedCategory;
};

// Delete a category from the menu
const deleteCategoryFromMenu = async (restaurantId, categoryId) => {
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) throw new Error('Restaurant not found');

    restaurant.menu = restaurant.menu.filter(
        (menuCategoryId) => menuCategoryId.toString() !== categoryId
    );
    await restaurant.save();

    return await CategoryItem.findByIdAndDelete(categoryId);
};

// Get all categories for a specific restaurant
const getCategoriesForRestaurant = async (restaurantId) => {
    const restaurant = await Restaurant.findById(restaurantId).populate('menu');
    if (!restaurant) throw new Error('Restaurant not found');
    return restaurant.menu;
};

module.exports = {
    addCategoryToMenu,
    deleteCategoryFromMenu,
    getCategoriesForRestaurant
};
