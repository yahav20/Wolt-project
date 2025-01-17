const NaiveStrategy = require("../strategies/naiveStrategy");
const PrestigeStrategy = require("../strategies/prestigeStrategy");
const DeliveryPerson = require("../model/deliveryPerson");

async function assignDelivery(order) {
  const deliveryPersonnel = await DeliveryPerson.find({ available: true });

  if (deliveryPersonnel.length === 0) {
    throw new Error("No delivery personnel available.");
  }

  const strategy = order.total > 1000 ? new PrestigeStrategy() : new NaiveStrategy(); // if the price is bigger than 1000, we will assign faster delivery guy
  const deliveryPerson = strategy.assign(deliveryPersonnel, order);

  if (!deliveryPerson) throw new Error("No delivery personnel available.");
  await DeliveryPerson.findByIdAndUpdate(deliveryPerson._id, { available: false });
  return deliveryPerson;
}

async function getAllDeliveryPersonnel() {
  return await DeliveryPerson.find();
}

module.exports = { assignDelivery, getAllDeliveryPersonnel };
