const axios = require("axios");

const RESTAURANT_SERVICE = "http://localhost:5000/api/restaurants";

async function getRestaurantById(id) {
  try {
    const restaurant = await axios.get(`${RESTAURANT_SERVICE}/${id}`);
    return restaurant;
  } catch (error) {
    throw new Error("Failed to get restaurant data");
  }
}

module.exports = { getRestaurantById };
