const mongoose = require('mongoose');

// Restaurant Schema
const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: {
        type: String,
        required: true,
        enum: ['Italian', 'Pizza', 'Fast Food', 'Chinese', 'Indian', 'Dessert', 'Cafe'], // Add more types as needed
        default: 'Pizza'
    },
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true }
    },
    phone: { type: String, required: true },
    email: { type: String },
    website: { type: String },
    openingHours: {
        monday: { open: { type: String }, close: { type: String } },
        tuesday: { open: { type: String }, close: { type: String } },
        wednesday: { open: { type: String }, close: { type: String } },
        thursday: { open: { type: String }, close: { type: String } },
        friday: { open: { type: String }, close: { type: String } },
        saturday: { open: { type: String }, close: { type: String } },
        sunday: { open: { type: String }, close: { type: String } }
    },
    menu: [
        {
            type: mongoose.Schema.Types.String,
            ref: 'CategoryItem'
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);
