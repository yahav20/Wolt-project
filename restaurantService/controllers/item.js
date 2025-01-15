const itemService = require('../services/item');

// Add an item to a specific category
const addItemToCategory = async (req, res) => {
    try {
        const updatedCategory = await itemService.addItemToCategory(req.params.categoryId, req.body);
        res.status(201).json(updatedCategory);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteItemFromCategory = async (req, res) => {
    try {
        const { categoryId } = req.params; // Extract categoryId from the URL
        const { itemName } = req.body; // Extract itemName from the request body

        const updatedCategory = await itemService.deleteItemFromCategory(categoryId, itemName);
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

// Get a specific item by its name in a category
const getItemByName = async (req, res) => {
    try {
        const { categoryId } = req.params; // Extract categoryId from the URL
        const { itemName } = req.body; // Extract itemName from the request body

        const item = await itemService.getItemByName(categoryId, itemName);
        res.json(item);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};


module.exports = {
    addItemToCategory,
    deleteItemFromCategory,
    getItemsInCategory,
    getItemByName
};
