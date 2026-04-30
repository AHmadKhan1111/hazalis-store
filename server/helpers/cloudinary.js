const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const config = require("../config/config");
const streamifier = require("streamifier");

/* =========================
   CLOUDINARY CONFIG
========================= */
if (
  !config.cloudinary.cloudName ||
  !config.cloudinary.apiKey ||
  !config.cloudinary.apiSecret
) {
  console.error("❌ Cloudinary ENV variables are missing");
} else {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
  });

  console.log("✅ Cloudinary configured");
}

/* =========================
   MULTER CONFIG
========================= */
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

/* =========================
   IMAGE UPLOAD UTIL
========================= */
const imageUploadUtil = (fileBuffer, folder = "uploads") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

module.exports = {
  upload,
  imageUploadUtil,
};
