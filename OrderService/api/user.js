const axios = require("axios");

const USER_SERVICE = process.env.USERS_SERVICE + "/users";

async function getUserById(id) {
  
  try {
    const user = await axios.get(`${USER_SERVICE}/${id}`);
    return user.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get user data");
  }
}

async function updateOrderHistory(id, order) {
  try {
    await axios.patch(`${USER_SERVICE}/${id}`, {"order":order.id});
  } catch (error) {
    throw new Error("Failed to update user order history");
  }
}

module.exports = { getUserById , updateOrderHistory };
