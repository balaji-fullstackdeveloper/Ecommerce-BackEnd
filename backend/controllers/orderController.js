const captchAsyncError = require("../middlewares/captchAsyncError");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
//Create New Order - {{base_url}}/api/v1/order/new
exports.newOrder = captchAsyncError(async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
  } = req.body;
  const order = await Order.create({
    orderItems,
    shippingInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
    paidAt: Date.now(),
    user: req.user.id,
  });
  res.status(200).json({
    success: true,
    order,
  });
});

//Get single Order - {{base_url}}/api/v1/order/:id
exports.getSingleOrder = captchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) {
    return next(
      new ErrorHandler(`Order not found with this Id: ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    order,
  });
});

//Get Loggedin User orders - {{base_url}}/api/v1/order/myorders
exports.myOrders = captchAsyncError(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id });
  res.status(200).json({
    success: true,
    orders,
  });
});

//Admin: Get All Orders - {{base_url}}/api/v1/orders
exports.Orders = captchAsyncError(async (req, res, next) => {
  const orders = await Order.find();
  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });
  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

//Admin: Update Order / Order Status - {{base_url}}/api/v1/order/:id
exports.updateOrder = captchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (order.orderStatus == "Delivered") {
    return next(new ErrorHandler("Order has been already Delivered!", 400));
  }
  //Updating the product stock of each order Item
  order.orderItems.forEach(async (orderItem) => {
    await updateStock(orderItem.product, orderItem.quantity);
  });
  order.orderStatus = req.body.orderStatus;
  order.deliveredAt = Date.now();
  await order.save();

  res.status(200).json({
    success: true,
  });
});

async function updateStock(productId, quantity) {
  const product = await Product.findById(productId);
  product.stock = product.stock - quantity;
  product.save({ validateBeforeSave: false });
}

//Admin: Delete Order / Order Status - {{base_url}}/api/v1/order/:id
exports.deleteOrder = captchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new ErrorHandler(`Order not found with this Id: ${req.params.id}`, 404)
    );
  }
  await order.deleteOne();
  res.status(200).json({
    success: true,
  });
});
