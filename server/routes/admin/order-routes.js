const express = require("express");

const {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} = require("../../controllers/admin/order-controller");

const { authMiddleware } = require("../../controllers/auth/auth-controller");
const adminMiddleware = require("../../middleware/admin-middleware");

const router = express.Router();

router.get("/get", authMiddleware, adminMiddleware, getAllOrdersOfAllUsers);
router.get(
  "/details/:id",
  authMiddleware,
  adminMiddleware,
  getOrderDetailsForAdmin,
);
router.put("/update/:id", authMiddleware, adminMiddleware, updateOrderStatus);

module.exports = router;
