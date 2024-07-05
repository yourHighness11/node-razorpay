const router = require("express").Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const paymentId = crypto.randomBytes(16).toString("hex");
const Order = require("../models/Order");

router.post("/orders", async (req, res) => {
  const { amount, currency } = req.body;
  const options = {
    amount,
    currency,
    receipt: paymentId,
  };
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const createOrder = await instance.orders.create(options);
    const newOrder = new Order({
      amount: amount,
      amount_due: createOrder.amount_due,
      amount_paid: createOrder.amount_paid,
      attempts: createOrder.attempts,
      created_at: createOrder.created_at,
      currency: createOrder.currency,
      order_id: createOrder.id,
      receipt: paymentId,
      status: createOrder.status,
    });

    newOrder.save();
    res.json(createOrder);
  } catch (error) {
    console.log(error);
    res.json(error.message);
  }
});

router.post("/verify", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const checkPayment = await instance.payments.fetch(razorpay_payment_id);
    await Order.findOneAndUpdate(
      {
        order_id: razorpay_order_id,
      },
      {
        status: checkPayment.status,
      }
    );
    res.json({ message: "Payment successfull" });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
