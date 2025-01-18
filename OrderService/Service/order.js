const Order = require("../model/order");
const restaurantService = require("../api/restaurant");
const userService = require("../api/user");
const deliveryService = require("../api/delivery");

async function createOrder(data) {
  const { restaurantId, userId, menuItems } = data;

  // Fetch restaurant and user details
  const restaurant = await restaurantService.getRestaurantById(restaurantId);
  // Fetch user details
  const user = await userService.getUserById(userId);
  //checking user and restaurant exist
  if (!restaurant || !user) {
    throw new Error("Invalid restaurant or user data");
  }
  const total = calculateTotal(menuItems);
  // Save order to DB
  const order = new Order({
    userId,
    userName: user.name,
    userAddress: user.address,
    restaurantId,
    restaurantName: restaurant.name,
    items: menuItems,
    total,
  });
  await order.save();

  await userService.updateOrderHistory(userId, order);

  // deliveryService.postOrderToDelivery(order);

  return order;
}

// Helper function to calculate total order price
const calculateTotal = (items) => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

async function updateOrderStatus(orderId, status) {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error("Order not found");
  }
  order.status = status;
  await order.save();
  return order;
}

async function getAllOrders() {
  return await Order.find();
}

async function getOrderById(id) {
  return await Order.findById(id);
}

async function getOrderStatus(id) {
  const order = await getOrderById(id);
  if (order == null) {
    return null;
  }
  return order.status;
}

module.exports = {
  createOrder,
  updateOrderStatus,
  getAllOrders,
  getOrderById,
  getOrderStatus,
};
