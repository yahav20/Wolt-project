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
    default: "Received",
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
});

// Changing status method
Order.methods.nextStatus = function () {
  switch (this.status) {
    case OrderStatus.RECEIVED:
      this.status = OrderStatus.COOKING;
      break;
    case OrderStatus.COOKING:
      this.status = OrderStatus.READY_FOR_PICKUP;
      break;
    case OrderStatus.READY_FOR_PICKUP:
      this.status = OrderStatus.OUT_FOR_DELIVERY;
      break;
    case OrderStatus.OUT_FOR_DELIVERY:
      this.status = OrderStatus.COMPLETED;
      break;
    case OrderStatus.COMPLETED:
      throw new Error("Order is already completed. No further status changes allowed.");
    default:
      throw new Error("Invalid status transition.");
  }
};


module.exports = mongoose.model("Order", Order);
