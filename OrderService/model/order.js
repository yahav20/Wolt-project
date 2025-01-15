const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Enum for order statuses
const OrderStatus = {
  RECEIVED: "Received",
  COOKING: "Cooking",
  READY_FOR_PICKUP: "Ready for Pickup",
  OUT_FOR_DELIVERY: "Out for Delivery",
  COMPLETED: "Completed",
};

const Order = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userAddress: {
    type: String,
    required: true,
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  restaurantName: {
    type: String,
    required: true,
  },
  items: [{
    itemId: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
}],
  total: {
    type: Number,
    required: true,
    min: [0, "Total must be a non-negative number"],
  },
  status: {
    type: String,
    enum: Object.values(OrderStatus),
    default: OrderStatus.RECEIVED
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", Order);
