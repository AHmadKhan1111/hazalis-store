const express = require("express");
const {
  addCategory,
  fetchAllCategories,
  uploadCategoryIcon,
} = require("../../controllers/admin/category-controller");
const { upload } = require("../../helpers/cloudinary");

const { authMiddleware } = require("../../controllers/auth/auth-controller");
const adminMiddleware = require("../../middleware/admin-middleware");

const router = express.Router();

router.post("/add", authMiddleware, adminMiddleware, addCategory);
router.get("/get", fetchAllCategories);  // public - no auth needed
router.post(
  "/upload-icon/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("my_file"),
  uploadCategoryIcon,
);

module.exports = router;
