require("dotenv").config();

const NODE_ENV = process.env.NODE_ENV || "development";
const CLIENT_BASE_URL =
  process.env.CLIENT_BASE_URL ||
  (NODE_ENV === "production"
    ? "https://hazalis.com"
    : "http://localhost:5173");

const config = {
  port: process.env.PORT, // Railway handles PORT
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,

  clientBaseUrl: CLIENT_BASE_URL,
  nodeEnv: NODE_ENV,

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },

  paypal: {
    mode: process.env.PAYPAL_MODE || "sandbox",
    clientId: process.env.PAYPAL_CLIENT_ID,
    clientSecret: process.env.PAYPAL_CLIENT_SECRET,
    returnUrl: `${CLIENT_BASE_URL}/shop/paypal-return`,
    cancelUrl: `${CLIENT_BASE_URL}/shop/paypal-cancel`,
  },

  email: {
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    from: process.env.EMAIL_FROM || "noreply@hazalis.com",
  },
};

// 🔒 HARD FAIL for critical ENV (production safety)
const requiredVars = [
  "MONGO_URI",
  "JWT_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "PAYPAL_CLIENT_ID",
  "PAYPAL_CLIENT_SECRET",
];

requiredVars.forEach((v) => {
  if (!process.env[v]) {
    if (NODE_ENV === "production") {
      throw new Error(`❌ Missing required ENV variable: ${v}`);
    } else {
      console.warn(`⚠️ Missing ENV variable: ${v}`);
    }
  }
});

module.exports = config;
