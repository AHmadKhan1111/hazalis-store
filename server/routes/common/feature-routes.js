const express = require("express");

const {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImage,
} = require("../../controllers/common/feature-controller");
const { authMiddleware } = require("../../controllers/auth/auth-controller");
const adminMiddleware = require("../../middleware/admin-middleware");

const router = express.Router();

// Security: Banner management endpoints require authentication and admin privileges
router.post("/add", authMiddleware, adminMiddleware, addFeatureImage);
router.get("/get", getFeatureImages); // Publicly accessible to fetch banner images
router.delete(
  "/delete/:id",
  authMiddleware,
  adminMiddleware,
  deleteFeatureImage,
);

module.exports = router;
