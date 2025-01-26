const axios = require("axios");

const DELIVERY_SERVICE = "http://localhost:3800/api/";

async function postOrderToDelivery(order) {
  try {
    // Pass the order object in the body of the POST request
    const response = await axios.post(`${DELIVERY_SERVICE}`, order);
    return response.data; // Return only the data field of the response
  } catch (error) {
    throw new Error("Failed to post order");
  }
}

module.exports = { postOrderToDelivery };

