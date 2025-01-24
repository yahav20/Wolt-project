const express = require("express");
require("custom-env").env("prod", "../");

const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
// Import user API functions
const { getUserById, updateOrderHistory } = require("./api/user");
const { getRestaurantById } = require("./api/restaurant");  

// Initialize Express app
const app = express();
app.use(bodyParser.json());

// MongoDB connection setup
mongoose
  .connect("mongodb://localhost:27017/orders", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Endpoint to fetch user data
app.get("/api/user/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await getUserById(userId); // Use the `getUserById` function from `api/user.js`
    res.json(user);
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});


app.get("/api/restaurant/:id", async (req, res) => {
  const restaurantId = req.params.id;
  try {
    const user = await getRestaurantById(restaurantId); // Use the `getUserById` function from `api/user.js`
    res.json(user);
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});


// Default route to serve the order page
app.get("/orders", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "order.html"));
});

// Start the server
const PORT = process.env.ORDERS_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Order Service running on port ${PORT}`);
});
