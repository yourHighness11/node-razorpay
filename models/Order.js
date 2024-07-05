const { Schema, model } = require("mongoose");

const OrderSchema = new Schema({
  amount: Number,
  amount_due: Number,
  amount_paid: Number,
  attempts: Number,
  created_at: String,
  currency: String,
  order_id: String,
  receipt: String,
  status: {
    enum: ["created", "authorized", "captured", "refunded", "failed"],
    type: String,
  },
});

const Order = model("Order", OrderSchema);
module.exports = Order;
