const express = require("express");
const bodyParser = require("body-parser");
const orderRoute = require("../routes/order");

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

app.use("/order", orderRoute);

// Start the server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Order Service running on port ${PORT}`);
});
