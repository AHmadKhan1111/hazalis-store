const express = require("express");

const {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImage,
} = require("../../controllers/common/feature-controller");

// 🛡️ Sentinel: Import authentication and admin authorization middlewares
// to prevent unauthorized manipulation of common homepage features.
const { authMiddleware } = require("../../controllers/auth/auth-controller");
const adminMiddleware = require("../../middleware/admin-middleware");

const router = express.Router();

// 🛡️ Sentinel: Secure POST and DELETE routes with authMiddleware and adminMiddleware.
// This prevents unauthenticated users or standard users from adding or deleting feature images.
router.post("/add", authMiddleware, adminMiddleware, addFeatureImage);
router.get("/get", getFeatureImages); // Reading feature images can remain public
router.delete("/delete/:id", authMiddleware, adminMiddleware, deleteFeatureImage);

module.exports = router;
