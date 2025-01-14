const itemService = require('../services/itemService');

// Add an item to a specific category
const addItemToCategory = async (req, res) => {
    try {
        const updatedCategory = await itemService.addItemToCategory(req.params.categoryId, req.body);
        res.status(201).json(updatedCategory);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete an item from a specific category
const deleteItemFromCategory = async (req, res) => {
    try {
        const updatedCategory = await itemService.deleteItemFromCategory(req.params.categoryId, req.params.itemId);
        res.json(updatedCategory);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

// Get all items in a specific category
const getItemsInCategory = async (req, res) => {
    try {
        const items = await itemService.getItemsInCategory(req.params.categoryId);
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    addItemToCategory,
    deleteItemFromCategory,
    getItemsInCategory
};
