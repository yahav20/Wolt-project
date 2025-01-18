const axios = require("axios");

const RESTAURANT_SERVICE = process.env.RESTAURANT_SERVICE + "/api/restaurants";
console.log(RESTAURANT_SERVICE)
async function getRestaurantById(id) {
  try {
    const restaurant = await axios.get(`${RESTAURANT_SERVICE}/${id}`);
    return restaurant.data;
  } catch (error) {
    throw new Error("Failed to get restaurant data");
  }
}

module.exports = { getRestaurantById };
