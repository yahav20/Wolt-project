const Order = require("../models/order");
const orderService = require("../services/order");
const OrderStatus = require("../models/orderStatus"); // Enum for statuses

// Create a new order
const createOrder = async (req, res) => {
  try {
    const { userId, restaurantId, items } = req.body;
    // Create a new order
    const order = await orderService.createOrder(userId, restaurantId, items);
    //check if order 
    if (order.error) {
      res.status(404).json(order.error);
    }
    // Respond with the created order
    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update order status TODO: Refactor
const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!Object.values(OrderStatus).includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (error) {
    console.error("Error updating order status:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all orders TODO: Refactor
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get a specific order by ID TODO: Refactor
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
  createOrder,
  updateOrderStatus,
  getAllOrders,
  getOrderById,
};
