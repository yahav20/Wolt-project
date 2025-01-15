const Order = require("../models/order");
const orderService = require("../services/order");
const OrderStatus = require("../models/orderStatus"); // Enum for statuses

// Create a new order
const { createOrder, updateOrderStatus } = require('../services/orderService');

/**
 * Handles the creation of a new order.
 * Receives order details in the request body, passes them to the service layer,
 * and returns the created order or an error response.
 */
async function createOrderHandler(req, res) {
  try {
    const { restaurantId, userId, menuItems } = req.body;

    // Validate request payload
    if (!restaurantId || !userId || !Array.isArray(menuItems) || menuItems.length === 0) {
      return res.status(400).json({ message: 'Invalid request data' });
    }

    // Call service to create order
    const order = await createOrder(req.body);

    // Respond with the created order
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error.message);
    res.status(500).json({ message: error.message });
  }
}

/**
 * Handles updating the status of an existing order.
 * Receives the order ID in the request params and the new status in the body.
 */
async function updateOrderStatusHandler(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate request payload
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    // Call service to update the order status
    const updatedOrder = await updateOrderStatus(id, status);

    // Respond with the updated order
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error.message);
    res.status(500).json({ message: error.message });
  }
}

// Get all orders 
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get a specific order by ID 
const getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createOrderHandler,
  getOrderById,
  getAllOrders,
  updateOrderStatusHandler,
};

