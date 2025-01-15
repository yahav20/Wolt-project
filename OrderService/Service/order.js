const Order = require("../model/order");
const restaurantService = require("../service/restaurant");
const userService = require("../service/user");
const deliveryService = require("../service/delivery");

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
    userName: user.name ,
    userAddress: user.address,
    restaurantId,
    restaurantName: restaurant.name,
    items:menuItems,
    total
  });
  await order.save();

  await userService.updateOrderHistory(userId,order);
  // deliveryService.postOrderToDelivery(order);


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
