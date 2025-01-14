const mongoose = require('mongoose');

// Item Schema
const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },         // Item name
    description: { type: String },                 // Item description
    price: { type: Number, required: true },       // Item price
    imageUrl: { type: String },                    // Optional image URL
    availability: { type: Boolean, default: true } // Item availability
}, { _id: false }); // Prevent creating a separate ObjectId for each item

module.exports = itemSchema;