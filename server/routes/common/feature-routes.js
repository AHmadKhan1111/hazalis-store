const express = require("express");

const {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImage,
} = require("../../controllers/common/feature-controller");
const { authMiddleware } = require("../../controllers/auth/auth-controller");
const adminMiddleware = require("../../middleware/admin-middleware");

const router = express.Router();

// Only authenticated admin users should be allowed to add or delete feature banners
router.post("/add", authMiddleware, adminMiddleware, addFeatureImage);
// Public route - anyone can view feature banners
router.get("/get", getFeatureImages);
router.delete("/delete/:id", authMiddleware, adminMiddleware, deleteFeatureImage);

module.exports = router;
