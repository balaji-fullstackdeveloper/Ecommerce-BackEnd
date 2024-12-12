const express = require("express");
const {
  processPayment,
  sendStripeApi,
  sendRazorpayOrders,
  verifyRazorpayPayment,
} = require("../controllers/paymentController");
const { isAuthenticatedUser } = require("../middlewares/authenticate");
const router = express.Router();

router.route("/payment/process").post(isAuthenticatedUser, processPayment);
router.route("/stripeapi").get(isAuthenticatedUser, sendStripeApi);
router
  .route("/payment/razorpay/orders")
  .post(isAuthenticatedUser, sendRazorpayOrders);
router
  .route("/payment/razorpay/verify")
  .post(isAuthenticatedUser, verifyRazorpayPayment);
module.exports = router;
