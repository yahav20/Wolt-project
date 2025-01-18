const express = require("express");
require('custom-env').env("prod",'../');

const bodyParser = require("body-parser");
const orderRoute = require("./routes/order");
const mongoose = require("mongoose");
const path = require('path');

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

app.use("/api/orders", orderRoute);

app.use(express.static(path.join(__dirname, 'public')));

// Default route
app.get('/orders', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'order.html'));
});

// Start the server
const PORT = process.env.ORDERS_PORT;
app.listen(PORT, () => {
  console.log(`Order Service running on port ${PORT}`);
});
