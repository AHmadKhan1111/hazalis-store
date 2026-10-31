const express = require("express");

const {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImage,
} = require("../../controllers/common/feature-controller");
const { authMiddleware } = require("../../controllers/auth/auth-controller");
const adminMiddleware = require("../../middleware/admin-middleware");

const router = express.Router();

// Public route to fetch banners for homepage display
router.get("/get", getFeatureImages);

// Admin-only routes to prevent unauthorized banner uploads or deletions
router.post("/add", authMiddleware, adminMiddleware, addFeatureImage);
router.delete("/delete/:id", authMiddleware, adminMiddleware, deleteFeatureImage);

module.exports = router;
