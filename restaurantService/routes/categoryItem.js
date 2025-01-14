const express = require('express');
const router = express.Router();
const categoryItemController = require('../controllers/categoryItem');

// Add a new category to the menu
router.post('/:restaurantId', categoryItemController.addCategoryToMenu);

// Delete a category from the menu
router.delete('/:restaurantId/:categoryId', categoryItemController.deleteCategoryFromMenu);

// Get all categories for a specific restaurant
router.get('/:restaurantId', categoryItemController.getCategoriesForRestaurant);

module.exports = router;
