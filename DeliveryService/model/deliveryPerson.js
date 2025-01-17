const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const DeliveryPersonSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  speed: {
    type: Number, // The lower the faster
    required: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("DeliveryPerson", DeliveryPersonSchema);
