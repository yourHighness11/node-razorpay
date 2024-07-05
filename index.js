require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 4002;
const bodyParser = require("body-parser");
const paymentRouter = require("./routes/Payment");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/payment", paymentRouter);

mongoose.connect(process.env.MONGO_URI + "razor_pay_db").then(() => {
  console.log("connected to mongoose");
});

app.listen(port, () => {
  console.log(`server running on ${port}`);
});
