const Order = require("../model/order");
const restaurantService = require("../services/restaurant");
const userService = require("../services/user");

async function CreateOrder(userId, restaurantId, items) {
  // Fetch restaurant and user details
  const restaurant = await restaurantService.getRestaurantById(restaurantId);
  // Fetch user details
  const user = await userService.getUserById(userId);
  // Check if restaurant exists
  if (!restaurant) return { error: "Restaurant not found" };
  // Check if user exists
  if (!user) return { error: "User not found" };
  // Calculate total
  const total = calculateTotal(items);
  // Create and save order
  const order = new Order({
    userId,
    userAddress: user.address,
    restaurantId,
    restaurantName: restaurant.name,
    items,
    total,
    status: OrderStatus.NEW,
  });
  //save order
  await order.save();
  //update user order history
  await userService.updateOrderHistory(userId, items);
}

// Helper function to calculate total order price
const calculateTotal = (items) => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

module.exports = { CreateOrder };
