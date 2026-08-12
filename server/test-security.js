const assert = require("assert");
const crypto = require("crypto");
const authController = require("./controllers/auth/auth-controller");
const config = require("./config/config");
const User = require("./models/User");

// Mocking mongoose model functions to avoid real DB connections in this unit test
let savedUser = null;

User.findOne = async function(query) {
  if (query.email === "test@example.com") {
    return {
      userName: "Test User",
      email: "test@example.com",
      save: async function() {
        savedUser = this;
      }
    };
  }
  if (query.resetPasswordToken) {
    if (savedUser && savedUser.resetPasswordToken === query.resetPasswordToken) {
      if (query.resetPasswordExpires && query.resetPasswordExpires.$gt < Date.now()) {
        return null; // expired
      }
      return savedUser;
    }
  }
  return null;
};

async function testPasswordResetHashing() {
  console.log("Running password reset SHA-256 hashing test...");

  // 1. Test forgotPassword hashes the token in DB but logs the raw token
  let loggedUrl = null;
  const originalLog = console.log;
  console.log = function(...args) {
    const msg = args.join(" ");
    if (msg.includes("FORGOT PASSWORD LINK")) {
      loggedUrl = msg;
    }
  };

  const reqForgot = { body: { email: "test@example.com" } };
  let forgotStatus = null;
  let forgotJson = null;
  const resForgot = {
    status: function(code) {
      forgotStatus = code;
      return this;
    },
    json: function(data) {
      forgotJson = data;
      return this;
    }
  };

  await authController.forgotPassword(reqForgot, resForgot);
  console.log = originalLog; // restore

  assert.strictEqual(forgotStatus, 200, "Forgot password response status should be 200");
  assert.ok(savedUser, "User should be found and modified");
  assert.ok(savedUser.resetPasswordToken, "User should have resetPasswordToken");
  assert.ok(savedUser.resetPasswordExpires, "User should have resetPasswordExpires");

  // Verify token in DB is hashed with SHA-256 (length of SHA-256 hex is 64 chars)
  assert.strictEqual(savedUser.resetPasswordToken.length, 64, "Database token should be a 64-character SHA-256 hash");

  // Extract token from loggedUrl
  assert.ok(loggedUrl, "Should log the raw token link in development mode");
  const tokenMatch = loggedUrl.match(/token=([a-f0-9]+)/);
  assert.ok(tokenMatch, "Logged URL should contain hex token");
  const rawToken = tokenMatch[1];

  // Confirm that SHA-256 of rawToken equals the hashed token stored in DB
  const computedHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  assert.strictEqual(computedHash, savedUser.resetPasswordToken, "Hashed token in database must match SHA-256 of the raw token");

  console.log("✅ Forgot password SHA-256 token hashing works correctly!");

  // 2. Test resetPassword
  const reqReset = {
    body: {
      token: rawToken,
      newPassword: "SecureNewPassword123"
    }
  };
  let resetStatus = null;
  let resetJson = null;
  const resReset = {
    status: function(code) {
      resetStatus = code;
      return this;
    },
    json: function(data) {
      resetJson = data;
      return this;
    }
  };

  await authController.resetPassword(reqReset, resReset);
  assert.strictEqual(resetStatus, 200, "Reset password response status should be 200");
  assert.strictEqual(savedUser.resetPasswordToken, undefined, "Token should be cleared after reset");
  assert.strictEqual(savedUser.resetPasswordExpires, undefined, "Expiry should be cleared after reset");

  console.log("✅ Reset password successfully processes raw token, verifies against hashed DB token, and clears token on success!");
}

async function testSecureCookieOptions() {
  console.log("Running secure cookie options test...");

  // Mock User findOne for login
  User.findOne = async function(query) {
    if (query.email === "login@example.com") {
      return {
        _id: "userId123",
        userName: "LoginUser",
        email: "login@example.com",
        password: "hashed_password_placeholder",
        role: "user"
      };
    }
    return null;
  };

  const bcrypt = require("bcryptjs");
  const originalCompare = bcrypt.compare;
  bcrypt.compare = async function() { return true; };

  process.env.JWT_SECRET = "test_jwt_secret_key_123456";
  config.jwtSecret = "test_jwt_secret_key_123456";

  const reqLogin = {
    body: {
      email: "login@example.com",
      password: "password123"
    }
  };

  // Test in development env (secure should be false)
  config.nodeEnv = "development";
  let cookieName = null;
  let cookieVal = null;
  let cookieOpts = null;
  const resLoginDev = {
    status: function() { return this; },
    cookie: function(name, val, opts) {
      cookieName = name;
      cookieVal = val;
      cookieOpts = opts;
      return this;
    },
    json: function() { return this; }
  };

  await authController.loginUser(reqLogin, resLoginDev);
  assert.strictEqual(cookieName, "token");
  assert.strictEqual(cookieOpts.secure, false, "In development, secure cookie option should be false");

  // Test in production env (secure should be true)
  config.nodeEnv = "production";
  let cookieOptsProd = null;
  const resLoginProd = {
    status: function() { return this; },
    cookie: function(name, val, opts) {
      cookieOptsProd = opts;
      return this;
    },
    json: function() { return this; }
  };

  await authController.loginUser(reqLogin, resLoginProd);
  assert.strictEqual(cookieOptsProd.secure, true, "In production, secure cookie option should be true");

  // Test logoutUser in production env (secure should be true)
  let clearCookieName = null;
  let clearCookieOpts = null;
  const resLogout = {
    clearCookie: function(name, opts) {
      clearCookieName = name;
      clearCookieOpts = opts;
      return this;
    },
    json: function() { return this; }
  };
  authController.logoutUser({}, resLogout);
  assert.strictEqual(clearCookieName, "token");
  assert.strictEqual(clearCookieOpts.secure, true, "In production, logout cookie secure option should be true");

  bcrypt.compare = originalCompare; // restore
  console.log("✅ Cookie secure options behave correctly based on environment!");
}

async function runAllTests() {
  try {
    await testPasswordResetHashing();
    await testSecureCookieOptions();
    console.log("\n🎉 ALL SECURITY VERIFICATION TESTS PASSED SUCCESSFULLY!");
    process.exit(0);
  } catch (err) {
    console.error("❌ TEST FAILED:", err);
    process.exit(1);
  }
}

runAllTests();
