const axios = require("axios");

const ORDER_SERVICE = process.env.ORDERS_SERVICE + `/api/orders`;

async function updateOrderStatus(orderId, status) {
  try {
    const response = await axios.patch(`${ORDER_SERVICE}/${orderId}/status`, { status }); // send status change request
    return response.data;
  } catch (error) {
    console.error("Failed to update order status:", error.message);
    throw new Error("Failed to update order status");
  }
}

module.exports = { updateOrderStatus };
