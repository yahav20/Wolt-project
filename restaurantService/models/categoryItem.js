const mongoose = require('mongoose');
const itemSchema = require('./item'); // Import the Item schema

// CategoryItem Schema
const categoryItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true // Ensures no leading/trailing whitespace
    },
    items: {
        type: [itemSchema],
        validate: {
            validator: (items) => Array.isArray(items),
            message: 'Items must be an array of valid Item objects.'
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('CategoryItem', categoryItemSchema);
