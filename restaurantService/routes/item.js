const express = require('express');
const router = express.Router();
const itemController = require('../controllers/item');

// Add an item to a specific category
router.post('/:categoryId', itemController.addItemToCategory);

// Delete an item from a specific category
router.delete('/:categoryId/:itemId', itemController.deleteItemFromCategory);

// Get all items in a specific category
router.get('/:categoryId', itemController.getItemsInCategory);

//Get a specific item by its ID in a category
router.get('/:categoryId/items/:itemId', itemController.getItemById);

module.exports = router;
