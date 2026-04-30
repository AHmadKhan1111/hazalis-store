const config = require("./config/config");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const adminOrderRouter = require("./routes/admin/order-routes");
const adminCategoryRouter = require("./routes/admin/category-routes");

const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopReviewRouter = require("./routes/shop/review-routes");
const shopCategoryRouter = require("./routes/shop/category-routes");

const commonFeatureRouter = require("./routes/common/feature-routes");

const app = express();
app.set("trust proxy", 1); // Trust Cloudflare headers
const fs = require("fs");
const path = require("path");

// LOGGING FUNCTION
const logError = (msg) => {
  const logPath = path.join(__dirname, "server_startup.log");
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logPath, `[${timestamp}] ${msg}\n`);
};

process.on("uncaughtException", (err) => {
  logError(`UNCAUGHT EXCEPTION: ${err.stack}`);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  logError(`UNHANDLED REJECTION: ${err.stack}`);
  process.exit(1);
});

logError("Starting server initialization...");

/* =========================
   DATABASE
========================= */
mongoose
  .connect(config.mongoUri)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  });

/* =========================
   CORS
========================= */
const allowedOrigins = [
  "http://localhost:5173",
  "https://hazalis.com",
  "https://www.hazalis.com",
  "https://api.hazalis.com",
  "http://13.63.128.118",
  config.clientBaseUrl,
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow server-to-server & Postman
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.error("❌ CORS blocked:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
  }),
);

// Preflight
app.options("*", cors());

/* =========================
   MIDDLEWARE
========================= */
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use((req, res, next) => {
  console.log(`[DEBUG] ${req.method} ${req.url}`);
  console.log(`[DEBUG] Protocol: ${req.protocol}, Secure: ${req.secure}`);
  console.log(`[DEBUG] X-Forwarded-Proto: ${req.headers["x-forwarded-proto"]}`);
  next();
});

/* =========================
   ROUTES
========================= */
app.use("/api/auth", authRouter);

app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);
app.use("/api/admin/categories", adminCategoryRouter);

app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);
app.use("/api/shop/categories", shopCategoryRouter);

app.use("/api/common/feature", commonFeatureRouter);

/* =========================
   HEALTH CHECK
========================= */
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    env: config.nodeEnv,
  });
});

/* =========================
   API 404 HANDLER
========================= */
// This ensures that any /api/* request that wasn't handled above returns JSON 404
// instead of falling through to the React app (index.html).
app.use("/api/*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

/* =========================
   STATIC FILES (FRONTEND)
========================= */
app.use(express.static(path.join(__dirname, "/client-dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client-dist", "index.html"));
});

/* =========================
   SERVER
========================= */
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log("🌐 Allowed Origins:", allowedOrigins);
  console.log("🌱 Environment:", config.nodeEnv);
  console.log("🖥️ Client Base URL:", config.clientBaseUrl);
});
