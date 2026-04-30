const express = require("express");
const { fetchAllCategories } = require("../../controllers/admin/category-controller");

const router = express.Router();

// Public route - no auth required
router.get("/get", fetchAllCategories);

module.exports = router;
