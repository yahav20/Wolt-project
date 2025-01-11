const express = require("express");
const OrderController= require("../controllers/order");

const router = express.Router();

// Create a new order
router.post("/", OrderController.createOrder);

// Update order status
router.patch("/:id/status", OrderController.updateOrderStatus);

// Get all orders
router.get("/", OrderController.getAllOrders);

// Get a specific order by ID
router.get("/:id", OrderController.getOrderById);

module.exports = router;
