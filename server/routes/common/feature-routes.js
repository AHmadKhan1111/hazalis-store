const express = require("express");

const {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImage,
} = require("../../controllers/common/feature-controller");
const { authMiddleware } = require("../../controllers/auth/auth-controller");
const adminMiddleware = require("../../middleware/admin-middleware");

const router = express.Router();

// Protected admin routes for adding and deleting feature banner images
router.post("/add", authMiddleware, adminMiddleware, addFeatureImage);
router.delete("/delete/:id", authMiddleware, adminMiddleware, deleteFeatureImage);

// Public route for fetching feature banner images
router.get("/get", getFeatureImages);

module.exports = router;
