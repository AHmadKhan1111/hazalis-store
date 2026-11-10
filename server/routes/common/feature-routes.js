const express = require("express");

const {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImage,
} = require("../../controllers/common/feature-controller");
const { authMiddleware } = require("../../controllers/auth/auth-controller");
const adminMiddleware = require("../../middleware/admin-middleware");

const router = express.Router();

// Require authentication and admin role to modify feature banners
router.post("/add", authMiddleware, adminMiddleware, addFeatureImage);
// Public endpoint - used by home page to display promotional banners
router.get("/get", getFeatureImages);
// Require authentication and admin role to delete feature banners
router.delete("/delete/:id", authMiddleware, adminMiddleware, deleteFeatureImage);

module.exports = router;
