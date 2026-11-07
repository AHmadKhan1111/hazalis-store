const Product = require("../../models/Product");

// Security helper: Escape regex special characters to prevent Regex Injection (ReDoS)
const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const searchProducts = async (req, res) => {
  try {
    const { keyword } = req.params;
    if (!keyword || typeof keyword !== "string") {
      return res.status(400).json({
        success: false,
        message: "Keyword is required and must be in string format",
      });
    }

    const trimmedKeyword = keyword.trim();
    // Security check: limit keyword length to prevent Denial of Service (DoS)
    if (trimmedKeyword.length === 0 || trimmedKeyword.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Keyword must be between 1 and 100 characters",
      });
    }

    // Sanitize user input before constructing RegExp
    const sanitizedKeyword = escapeRegex(trimmedKeyword);
    const regEx = new RegExp(sanitizedKeyword, "i");

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
