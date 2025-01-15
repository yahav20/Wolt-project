const CategoryItem = require('../models/categoryItem');

// Add an item to a specific category
const addItemToCategory = async (categoryId, itemData) => {
    // Validate categoryId
    if (!categoryId) throw new Error('Category ID is required');

    // Validate item data
    const requiredFields = ['name', 'price'];
    requiredFields.forEach((field) => {
        if (!itemData[field]) {
            throw new Error(`Missing required field: ${field}`);
        }
    });

    if (typeof itemData.name !== 'string' || itemData.name.trim().length < 2) {
        throw new Error('Item name must be a string and at least 2 characters long.');
    }

    if (typeof itemData.price !== 'number' || itemData.price <= 0) {
        throw new Error('Item price must be a positive number.');
    }

    if (itemData.description && typeof itemData.description !== 'string') {
        throw new Error('Item description must be a string.');
    }

    if (itemData.imageUrl && !/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(itemData.imageUrl)) {
        throw new Error('Invalid image URL format.');
    }

    if (itemData.availability && typeof itemData.availability !== 'boolean') {
        throw new Error('Item availability must be a boolean value.');
    }

    // Check if the category exists
    const category = await CategoryItem.findById(categoryId);
    if (!category) throw new Error('Category not found');

    // Add the item to the category
    category.items.push(itemData);
    return await category.save();
};

// Delete an item from a specific category
const deleteItemFromCategory = async (categoryId, itemId) => {
    // Validate categoryId and itemId
    if (!categoryId) throw new Error('Category ID is required');
    if (!itemId) throw new Error('Item ID is required');

    const category = await CategoryItem.findById(categoryId);
    if (!category) throw new Error('Category not found');

    // Check if the item exists in the category
    const itemExists = category.items.some((item) => item._id.toString() === itemId);
    if (!itemExists) throw new Error('Item not found in the category');

    // Remove the item
    category.items = category.items.filter((item) => item._id.toString() !== itemId);
    return await category.save();
};

// Get all items in a specific category
const getItemsInCategory = async (categoryId) => {
    // Validate categoryId
    if (!categoryId) throw new Error('Category ID is required');

    const category = await CategoryItem.findById(categoryId);
    if (!category) throw new Error('Category not found');

    return category.items;
};

// Get a specific item by its ID in a specific category
const getItemById = async (categoryId, itemId) => {
    // Validate categoryId and itemId
    if (!categoryId) throw new Error('Category ID is required');
    if (!itemId) throw new Error('Item ID is required');

    const category = await CategoryItem.findById(categoryId);
    if (!category) throw new Error('Category not found');

    const item = category.items.find((item) => item._id.toString() === itemId);
    if (!item) throw new Error('Item not found in the category');

    return item;
};

module.exports = {
    addItemToCategory,
    deleteItemFromCategory,
    getItemsInCategory,
    getItemById
};
