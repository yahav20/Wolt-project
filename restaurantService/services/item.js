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

// Get a specific item by its ID in a specific category
const getItemById = async (categoryId, itemId) => {
    const category = await CategoryItem.findById(categoryId);
    if (!category) throw new Error('Category not found');

    const item = category.items.find(
        (item) => item._id.toString() === itemId
    );

    if (!item) throw new Error('Item not found');
    return item;
};

module.exports = {
    addItemToCategory,
    deleteItemFromCategory,
    getItemsInCategory,
    getItemById
};
