const express = require("express");
const {
  newOrder,
  getSingleOrder,
  myOrders,
  Orders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middlewares/authenticate");
const router = express.Router();

router.route("/order/new").post(isAuthenticatedUser, newOrder);
router
  .route("/order/:id")
  .get(isAuthenticatedUser, getSingleOrder)
  .delete(isAuthenticatedUser, deleteOrder);
router.route("/myorders").get(isAuthenticatedUser, myOrders);

//Admin Routes -
router
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorizeRoles("admin"), Orders);
router
  .route("/admin/order/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);

module.exports = router;
