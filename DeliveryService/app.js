const express = require("express");
const mongoose = require("mongoose");
const deliveryRoutes = require("./routes/delivery");
const path = require('path');  
const app = express();

// Middleware for parsing JSON
app.use(express.json());

// Register delivery routes
app.use("/api", deliveryRoutes);

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'track.html'));
});

// Connect to MongoDB
mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("MongoDB connection error:", err);
});

const PORT = process.env.DELIVERY_PORT;
app.listen(PORT, () => {
    console.log(`Delivery Microservice running on port ${PORT}`);
});
