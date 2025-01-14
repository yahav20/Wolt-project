const CategoryItem = require('../models/categoryItem');

// Add an item to a specific category
const addItemToCategory = async (categoryId, itemData) => {
    const category = await CategoryItem.findById(categoryId);
    if (!category) throw new Error('Category not found');

    category.items.push(itemData);
    return await category.save();
};

// Delete an item from a specific category
const deleteItemFromCategory = async (categoryId, itemId) => {
    const category = await CategoryItem.findById(categoryId);
    if (!category) throw new Error('Category not found');

    category.items = category.items.filter(
        (item) => item._id.toString() !== itemId
    );
    return await category.save();
};

// Get all items in a specific category
const getItemsInCategory = async (categoryId) => {
    const category = await CategoryItem.findById(categoryId);
    if (!category) throw new Error('Category not found');
    return category.items;
};

module.exports = {
    addItemToCategory,
    deleteItemFromCategory,
    getItemsInCategory
};
