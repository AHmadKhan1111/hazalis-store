// Set env vars at the very top before any require
process.env.NODE_ENV = "production";
process.env.MONGO_URI = "mongodb://localhost:27017/dummy";
process.env.JWT_SECRET = "test_secret";
process.env.CLOUDINARY_CLOUD_NAME = "dummy_cloud";
process.env.CLOUDINARY_API_KEY = "dummy_key";
process.env.CLOUDINARY_API_SECRET = "dummy_secret";
process.env.PAYPAL_CLIENT_ID = "dummy_paypal_id";
process.env.PAYPAL_CLIENT_SECRET = "dummy_paypal_secret";

const assert = require("assert");
const crypto = require("crypto");

// Mock dependencies
const mockUserInstance = {
  email: "test@example.com",
  userName: "TestUser",
  role: "user",
  password: "hashed_password",
  save: async function() {
    this.saveCalled = true;
  }
};

const mockUserClass = {
  findOne: async function(query) {
    this.lastQuery = query;
    if (query.email === "test@example.com" || query.resetPasswordToken) {
      return mockUserInstance;
    }
    return null;
  }
};

// Require our modules and substitute mock User
const Module = require("module");
const originalRequire = Module.prototype.require;
Module.prototype.require = function(path) {
  if (path.endsWith("../../models/User")) {
    return mockUserClass;
  }
  return originalRequire.apply(this, arguments);
};

// Now import the controller
const authController = require("./controllers/auth/auth-controller");

async function runTests() {
  console.log("-----------------------------------------");
  console.log("RUNNING SECURITY VERIFICATION TESTS");
  console.log("-----------------------------------------");

  let cookieSet = {};
  const mockResLogin = {
    status: function(code) {
      this.statusCode = code;
      return this;
    },
    cookie: function(name, token, options) {
      cookieSet = { name, token, options };
      return this;
    },
    json: function(data) {
      this.jsonData = data;
      return this;
    }
  };

  const mockReqLogin = {
    body: { email: "test@example.com", password: "password" }
  };

  // Mock bcrypt comparison to pass
  const bcrypt = require("bcryptjs");
  const originalCompare = bcrypt.compare;
  bcrypt.compare = async () => true;

  try {
    await authController.loginUser(mockReqLogin, mockResLogin);
    assert.strictEqual(cookieSet.options.secure, true, "Cookie secure flag should be true in production");
    console.log("✅ PASS: Secure cookie flag is enabled in production");
  } catch (err) {
    console.error("❌ FAIL: Login cookie secure flag test failed", err);
    process.exit(1);
  } finally {
    bcrypt.compare = originalCompare;
  }

  // Test 2: forgotPassword hashes resetPasswordToken using SHA-256
  const mockResForgot = {
    status: function(code) {
      this.statusCode = code;
      return this;
    },
    json: function(data) {
      this.jsonData = data;
      return this;
    }
  };

  const mockReqForgot = {
    body: { email: "test@example.com" }
  };

  mockUserInstance.saveCalled = false;
  mockUserInstance.resetPasswordToken = undefined;

  try {
    await authController.forgotPassword(mockReqForgot, mockResForgot);
    assert.ok(mockUserInstance.saveCalled, "User save should be called");
    assert.ok(mockUserInstance.resetPasswordToken, "resetPasswordToken must be generated");
    assert.strictEqual(mockUserInstance.resetPasswordToken.length, 64, "Token should be a 64-character SHA-256 hash hex string");
    console.log("Generated secure token hash:", mockUserInstance.resetPasswordToken);
    console.log("✅ PASS: Password reset tokens are stored as SHA-256 hashes");
  } catch (err) {
    console.error("❌ FAIL: Forgot password hashing test failed", err);
    process.exit(1);
  }

  // Test 3: resetPassword hashes incoming token and queries User with the hash
  const mockResReset = {
    status: function(code) {
      this.statusCode = code;
      return this;
    },
    json: function(data) {
      this.jsonData = data;
      return this;
    }
  };

  const plaintextToken = "abcdef1234567890";
  const mockReqReset = {
    body: { token: plaintextToken, newPassword: "newSecurePassword" }
  };

  try {
    await authController.resetPassword(mockReqReset, mockResReset);
    const expectedHash = crypto.createHash("sha256").update(plaintextToken).digest("hex");
    assert.strictEqual(mockUserClass.lastQuery.resetPasswordToken, expectedHash, "Database query should lookup the SHA-256 hash of the token");
    console.log("✅ PASS: Reset password query correctly hashes incoming token using SHA-256");
  } catch (err) {
    console.error("❌ FAIL: Reset password query test failed", err);
    process.exit(1);
  }

  console.log("-----------------------------------------");
  console.log("ALL SECURITY TESTS PASSED SUCCESSFULLY! 🛡️");
  console.log("-----------------------------------------");
}

runTests().catch(err => {
  console.error("Unexpected test execution error:", err);
  process.exit(1);
});
