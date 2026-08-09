const crypto = require("crypto");
const assert = require("assert");

// Mock dependencies before importing auth-controller
const mockUser = {
  email: "test@example.com",
  userName: "TestUser",
  role: "user",
  _id: "mock_id_123",
  password: "hashed_old_password",
  save: async function() {
    this.saveCalled = true;
  }
};

const UserMock = {
  findOne: async function(query) {
    this.lastQuery = query;
    if (query.email === "test@example.com") {
      return mockUser;
    }
    if (query.resetPasswordToken) {
      // simulate finding user if token matches
      return mockUser;
    }
    return null;
  }
};

// Override require for models/User so it uses our mock
require.cache[require.resolve("./models/User")] = {
  id: require.resolve("./models/User"),
  filename: require.resolve("./models/User"),
  loaded: true,
  exports: UserMock
};

// Also mock config to avoid failure
const configMock = {
  jwtSecret: "test_secret",
  clientBaseUrl: "http://localhost:5173",
  email: {
    host: "", // force dev mode so nodemailer doesn't try to send actual mail
    user: ""
  }
};

require.cache[require.resolve("./config/config")] = {
  id: require.resolve("./config/config"),
  filename: require.resolve("./config/config"),
  loaded: true,
  exports: configMock
};

// Load the auth controller
const authController = require("./controllers/auth/auth-controller");

async function runTests() {
  console.log("--------------------------------------------------");
  console.log("🛡️ RUNNING SENTINEL SECURITY ENHANCEMENT TESTS...");
  console.log("--------------------------------------------------");

  // Test 1: Forgot Password Hashing
  console.log("Test 1: Forgot Password token is securely hashed...");
  mockUser.saveCalled = false;
  mockUser.resetPasswordToken = undefined;

  let loggedUrl = "";
  const originalLog = console.log;
  console.log = function(...args) {
    const msg = args.join(" ");
    if (msg.includes("FORGOT PASSWORD LINK")) {
      loggedUrl = msg;
    }
  };

  const reqForgot = { body: { email: "test@example.com" } };
  let forgotStatus = 0;
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
  console.log = originalLog; // restore log

  assert.strictEqual(forgotStatus, 200, "Forgot password should return 200");
  assert.ok(mockUser.saveCalled, "User save() should be called");
  assert.ok(mockUser.resetPasswordToken, "resetPasswordToken must be set in database");
  assert.strictEqual(mockUser.resetPasswordToken.length, 64, "resetPasswordToken must be a SHA-256 hex string (64 characters)");

  // Extract the raw token from the logged URL
  const tokenMatch = loggedUrl.match(/token=([a-f0-9]+)/);
  assert.ok(tokenMatch, "A reset link with plaintext token must be logged/generated");
  const plaintextToken = tokenMatch[1];

  // Verify that resetPasswordToken stored in Mongoose is the SHA-256 hash of the plaintext token
  const expectedHash = crypto.createHash("sha256").update(plaintextToken).digest("hex");
  assert.strictEqual(mockUser.resetPasswordToken, expectedHash, "Stored resetPasswordToken must match the SHA-256 hash of the plaintext token");
  console.log("✅ Test 1 Passed: Password reset token is securely hashed with SHA-256 in MongoDB.");

  // Test 2: Reset Password Queries with Hashed Token
  console.log("\nTest 2: Reset Password matches using SHA-256 hash...");
  UserMock.lastQuery = null;
  mockUser.saveCalled = false;

  const reqReset = {
    body: {
      token: plaintextToken,
      newPassword: "my_new_secure_password"
    }
  };
  let resetStatus = 0;
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
  assert.strictEqual(resetStatus, 200, "Reset password should succeed with status 200");
  assert.ok(UserMock.lastQuery, "Mongoose query should have run");
  assert.strictEqual(UserMock.lastQuery.resetPasswordToken, expectedHash, "Mongoose must query using the SHA-256 hash, NOT the plaintext token");
  assert.ok(mockUser.saveCalled, "User save() should be called to update password");
  assert.strictEqual(mockUser.resetPasswordToken, undefined, "resetPasswordToken should be cleared on success");
  console.log("✅ Test 2 Passed: Reset password matches incoming plaintext token against SHA-256 database hash.");

  // Test 3: Authentication Cookies Secure Option
  console.log("\nTest 3: Auth cookies use 'secure: true' in production...");

  // A) Development Mode (process.env.NODE_ENV !== "production")
  process.env.NODE_ENV = "development";
  let cookieName = "";
  let cookieVal = "";
  let cookieOpts = null;
  const resLoginDev = {
    cookie: function(name, val, opts) {
      cookieName = name;
      cookieVal = val;
      cookieOpts = opts;
      return this;
    },
    json: function() {}
  };

  const reqLogin = { body: { email: "test@example.com", password: "password" } };
  // Stub bcrypt compare to always succeed
  const bcrypt = require("bcryptjs");
  const originalCompare = bcrypt.compare;
  bcrypt.compare = async () => true;

  // Set process.env.JWT_SECRET
  process.env.JWT_SECRET = "test_jwt_secret";

  await authController.loginUser(reqLogin, resLoginDev);
  assert.strictEqual(cookieName, "token");
  assert.strictEqual(cookieOpts.secure, false, "In development, cookie secure option should be false");

  // B) Production Mode (process.env.NODE_ENV === "production")
  process.env.NODE_ENV = "production";
  let prodCookieOpts = null;
  const resLoginProd = {
    cookie: function(name, val, opts) {
      prodCookieOpts = opts;
      return this;
    },
    json: function() {}
  };

  await authController.loginUser(reqLogin, resLoginProd);
  assert.strictEqual(prodCookieOpts.secure, true, "In production, cookie secure option must be true");

  // C) Logout Cookie Secure option in Production
  let logoutCookieOpts = null;
  const resLogout = {
    clearCookie: function(name, opts) {
      logoutCookieOpts = opts;
      return this;
    },
    json: function() {}
  };
  await authController.logoutUser({}, resLogout);
  assert.strictEqual(logoutCookieOpts.secure, true, "In production, logout clearCookie secure option must be true");

  bcrypt.compare = originalCompare; // restore
  console.log("✅ Test 3 Passed: Cookies have secure option set correctly based on NODE_ENV.");

  console.log("\n--------------------------------------------------");
  console.log("🎉 ALL SENTINEL SECURITY TESTS PASSED SUCCESSFULLY!");
  console.log("--------------------------------------------------");
}

runTests().catch(err => {
  console.error("❌ Test run failed with error:", err);
  process.exit(1);
});
