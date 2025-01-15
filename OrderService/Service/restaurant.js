const axios = require("axios");

const RESTAURANT_SERVICE = "http://192.168.1.45:3000/api/restaurants";

async function getRestaurantById(id) {
  try {
    const restaurant = await axios.get(`${RESTAURANT_SERVICE}/${id}`);
    return restaurant.data;
  } catch (error) {
    throw new Error("Failed to get restaurant data");
  }
}

module.exports = { getRestaurantById };
