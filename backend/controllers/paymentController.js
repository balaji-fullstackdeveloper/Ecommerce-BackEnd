const catchAsyncError = require("../middlewares/catchAsyncError");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Razorpay = require("razorpay");
const crypto = require("crypto");
const ErrorHandler = require("../utils/errorHandler");
exports.processPayment = catchAsyncError(async (req, res, next) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "usd",
    description: "TEST PAYMENT",
    metadata: { integration_check: "accept_payment" },
    shipping: req.body.shipping,
  });

  res.status(200).json({
    success: true,
    client_secret: paymentIntent.client_secret,
  });
});

exports.sendStripeApi = catchAsyncError(async (req, res, next) => {
  res.status(200).json({
    stripeApiKey: process.env.STRIPE_API_KEY,
  });
});
exports.sendRazorpayOrders = catchAsyncError(async (req, res, next) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: req.body.amount * 100,
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    instance.orders.create(options, (error, order) => {
      if (error) {
        console.log(error);
        return next(
          new ErrorHandler("Error in creating order Instance in Razorpay", 401)
        );
      }
      res.status(200).json({ data: order });
    });
  } catch (error) {
    console.log(error);

    return next(new ErrorHandler("Error in creating order in Razorpay", 401));
  }
});
exports.verifyRazorpayPayment = catchAsyncError(async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      return res
        .status(200)
        .json({ success: true, message: "Payment verified successfully" });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature sent!" });
    }
  } catch (error) {
    console.log(error);
    return next(
      new ErrorHandler("Error in verifying payment in Razorpay", 401)
    );
  }
});
