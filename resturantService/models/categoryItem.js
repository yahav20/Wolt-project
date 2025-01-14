const mongoose = require('mongoose');
const itemSchema = require('./item'); // Import the Item schema

// CategoryItem Schema
const categoryItemSchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    items: [itemSchema] // Array of items within this category
}, { timestamps: true });

module.exports = mongoose.model('CategoryItem', categoryItemSchema);