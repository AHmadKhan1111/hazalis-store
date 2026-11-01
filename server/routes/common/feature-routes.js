const express = require("express");

const {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImage,
} = require("../../controllers/common/feature-controller");
const { authMiddleware } = require("../../controllers/auth/auth-controller");
const adminMiddleware = require("../../middleware/admin-middleware");

const router = express.Router();

// Public endpoint: Allow shoppers to view feature banner images
router.get("/get", getFeatureImages);

// Admin-only endpoints: Protect banner image modification from unauthorized tampering
router.post("/add", authMiddleware, adminMiddleware, addFeatureImage);
router.delete(
  "/delete/:id",
  authMiddleware,
  adminMiddleware,
  deleteFeatureImage,
);

module.exports = router;
