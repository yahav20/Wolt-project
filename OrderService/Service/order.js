const Order = require("../model/order");
const restaurantService = require("../service/restaurant");
const userService = require("../service/user");

async function createOrder(data) {
  const { restaurantId, userId, menuItems } = data;
  
  // Fetch restaurant and user details
  const restaurant = await restaurantService.getRestaurantById(restaurantId);
  // Fetch user details
  const user = await userService.getUserById(userId);

  if (!restaurant.data || !user.data) {
    throw new Error("Invalid restaurant or user data");
  }
  const total = calculateTotal(menuItems);
  // Save order to DB
  const order = new Order({
    userId,
    userAddress: user.address,
    restaurantId,
    restaurantName: restaurant.name,
    menuItems,
    total,
    status: "Pending",
  });
  await order.save();

  return order;
}

async function updateOrderStatus(orderId, status) {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error("Order not found");
  }
  order.status = status;
  await order.save();
  return order;
}
// Helper function to calculate total order price
const calculateTotal = (items) => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

module.exports = { createOrder, updateOrderStatus };
