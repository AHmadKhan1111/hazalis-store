const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    collection_icon: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", CategorySchema);
