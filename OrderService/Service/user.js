const axios = require("axios");

const USER_SERVICE = "http://localhost:5000/users";

async function getUserById(id) {
  try {
    const user = await axios.get(`${USER_SERVICE}/${id}`);
    return user;
  } catch (error) {
    throw new Error("Failed to get user data");
  }
}

async function updateOrderHistory(id, order) {
  try {
    await axios.post(`${USER_SERVICE}/${id}/orders`, order);
  } catch (error) {
    throw new Error("Failed to update user order history");
  }
}

module.exports = { getUserById , updateOrderHistory };
