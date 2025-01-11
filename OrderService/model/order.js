const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Enum for order statuses
const OrderStatus = {
    NEW: 'New',
    PREPARING: 'Preparing',
    COOKING: 'Cooking',
    READY_FOR_PICKUP: 'Ready for Pickup',
    OUT_FOR_DELIVERY: 'Out for Delivery',
    COMPLETED: 'Completed'
};

const Order = new Schema({
        userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
        },
        userAddress: {
                type: String,
                required: true
        },
        restaurantId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Restaurant',
                required: true
        },
        restaurantName: {
                type: String,
                required: true
        },
        items: {
                type: Array,
                required: true
        },
        total: {
                type: Number,
                required: true
        },
        status: {
                type: String,
                enum: Object.values(OrderStatus),
                default: OrderStatus.NEW
        },
        createdAt: {
                type: Date,
                default: Date.now
        }
});

module.exports = mongoose.model('Order', Order);