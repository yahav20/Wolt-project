const axios = require("axios");

const USER_SERVICE = "http://localhost:5000/restaurants";

async function getRestaurantById(id) {
  try {
    const user = await axios.get(`${USER_SERVICE}/${id}`);
    return user;
  } catch (error) {
    throw new Error("Failed to get user data");
  }
}

module.exports = { getRestaurantById };
