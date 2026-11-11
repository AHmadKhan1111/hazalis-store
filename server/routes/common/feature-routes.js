const express = require("express");

const {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImage,
} = require("../../controllers/common/feature-controller");

const { authMiddleware } = require("../../controllers/auth/auth-controller");
const adminMiddleware = require("../../middleware/admin-middleware");

const router = express.Router();

// Security: Feature banner mutations must require authentication and admin privileges
// to prevent unauthorized homepage defacement or deletion.
router.post("/add", authMiddleware, adminMiddleware, addFeatureImage);
// Public storefront display
router.get("/get", getFeatureImages);
router.delete("/delete/:id", authMiddleware, adminMiddleware, deleteFeatureImage);

module.exports = router;
