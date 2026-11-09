const Product = require("../../models/Product");

const searchProducts = async (req, res) => {
  try {
    const { keyword } = req.params;
    if (!keyword || typeof keyword !== "string") {
      return res.status(400).json({
        succes: false,
        message: "Keyword is required and must be in string format",
      });
    }

    // Limit keyword length to prevent resource exhaustion / DoS
    const trimmedKeyword = keyword.trim();
    if (trimmedKeyword.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Keyword exceeds maximum allowed length of 100 characters",
      });
    }

    // Escape regex metacharacters to prevent ReDoS (Regular Expression Denial of Service)
    const escapedKeyword = trimmedKeyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regEx = new RegExp(escapedKeyword, "i");

    const createSearchQuery = {
      $or: [
        { title: regEx },
        { description: regEx },
        { category: regEx },
        { brand: regEx },
      ],
    };

    const searchResults = await Product.find(createSearchQuery);

    res.status(200).json({
      success: true,
      data: searchResults,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

module.exports = { searchProducts };
