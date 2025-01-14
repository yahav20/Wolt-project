const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

// Add an item to a specific category
router.post('/:categoryId', itemController.addItemToCategory);

// Delete an item from a specific category
router.delete('/:categoryId/:itemId', itemController.deleteItemFromCategory);

// Get all items in a specific category
router.get('/:categoryId', itemController.getItemsInCategory);

module.exports = router;
