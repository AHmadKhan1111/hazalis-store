const express = require("express");

const {
  addAddress,
  fetchAllAddress,
  editAddress,
  deleteAddress,
} = require("../../controllers/shop/address-controller");

const { authMiddleware } = require("../../controllers/auth/auth-controller");

const router = express.Router();

router.post("/add", authMiddleware, addAddress);
router.get("/get/:userId", authMiddleware, fetchAllAddress);
router.delete("/delete/:userId/:addressId", authMiddleware, deleteAddress);
router.put("/update/:userId/:addressId", authMiddleware, editAddress);

module.exports = router;
