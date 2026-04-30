const Category = require("../../models/Category");
const { imageUploadUtil } = require("../../helpers/cloudinary");

const addCategory = async (req, res) => {
  try {
    const { id, label, collection_icon } = req.body;
    const newCategory = new Category({
      id,
      label,
      collection_icon,
    });

    await newCategory.save();
    res.status(201).json({
      success: true,
      data: newCategory,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

const fetchAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

const uploadCategoryIcon = async (req, res) => {
  try {
    const { id } = req.params;
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await imageUploadUtil(url);
    console.log("Cloudinary Upload Result:", result);

    if (result) {
      const category = await Category.findOneAndUpdate(
        { id: id },
        { collection_icon: result.secure_url },
        { new: true, upsert: true }, // Create if not exists (though ideally should exist)
      );

      console.log("Saved/Updated Category:", category);

      // If upserted and label missing, might want to handle that, but assuming simple update for now

      res.status(200).json({
        success: true,
        data: category,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Image upload failed",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

module.exports = { addCategory, fetchAllCategories, uploadCategoryIcon };
