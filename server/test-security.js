// Set critical environment variables before requiring any config or controller
process.env.NODE_ENV = "production";
process.env.MONGO_URI = "mongodb://localhost:27017/test";
process.env.JWT_SECRET = "testsecret_minimum_length_required_for_jwt";
process.env.CLOUDINARY_CLOUD_NAME = "dummy_cloudinary_cloud_name";
process.env.CLOUDINARY_API_KEY = "dummy_cloudinary_api_key";
process.env.CLOUDINARY_API_SECRET = "dummy_cloudinary_api_secret";
process.env.PAYPAL_CLIENT_ID = "dummy_paypal_client_id";
process.env.PAYPAL_CLIENT_SECRET = "dummy_paypal_client_secret";

const path = require("path");
const assert = require("assert");
const crypto = require("crypto");

// 1. Mock mongoose before requiring User model or auth-controller
const mockUsers = [];

const mockMongoose = {
  Schema: function() {
    return {};
  },
  model: function(name, schema) {
    return {
      findOne: async (query) => {
        for (const u of mockUsers) {
          if (query.email && u.email === query.email) {
            return u;
          }
          if (query.resetPasswordToken && u.resetPasswordToken === query.resetPasswordToken) {
            if (query.resetPasswordExpires && query.resetPasswordExpires.$gt && u.resetPasswordExpires > Date.now()) {
              return u;
            }
          }
        }
        return null;
      }
    };
  }
};

const mongoosePath = require.resolve("mongoose");
require.cache[mongoosePath] = {
  id: mongoosePath,
  filename: mongoosePath,
  loaded: true,
  exports: mockMongoose
};

// Require dependencies to ensure our mock is active
const User = require("./models/User");
const authController = require("./controllers/auth/auth-controller");

async function runTests() {
  console.log("=== Running Security Verification Tests ===");

  // Mock a user in the system
  const testUser = {
    userName: "testuser",
    email: "test@example.com",
    password: "hashedpassword",
    role: "user",
    save: async function() {
      // Just simulate save
      return this;
    }
  };
  mockUsers.push(testUser);

  // ----------------------------------------------------
  // TEST 1: Password Reset Token Hashing (forgotPassword)
  // ----------------------------------------------------
  console.log("\nTesting password reset hashing...");

  let loggedLink = "";
  // Intercept console.log to catch the link in Dev Mode
  const originalLog = console.log;
  console.log = (...args) => {
    const msg = args.join(" ");
    if (msg.includes("FORGOT PASSWORD LINK")) {
      loggedLink = msg;
    }
    // Suppress logging of details for a clean output
  };

  const reqForgot = {
    body: { email: "test@example.com" }
  };

  let resStatusForgot = 200;
  let resJsonForgot = null;
  const resForgot = {
    status: (s) => {
      resStatusForgot = s;
      return {
        json: (j) => {
          resJsonForgot = j;
        }
      };
    }
  };

  await authController.forgotPassword(reqForgot, resForgot);
  console.log = originalLog; // Restore console.log

  assert.strictEqual(resStatusForgot, 200, "Forgot password should return 200 OK");
  assert.ok(loggedLink, "A reset link should be logged in dev mode");

  // Extract the plain token from the logged URL
  const tokenMatch = loggedLink.match(/token=([a-f0-9]+)/);
  assert.ok(tokenMatch, "Plain token should be found in the logged URL");
  const plainToken = tokenMatch[1];

  // Verify that the stored token in database is hashed (SHA-256)
  const expectedHashedToken = crypto.createHash("sha256").update(plainToken).digest("hex");
  assert.strictEqual(testUser.resetPasswordToken, expectedHashedToken, "The token saved in DB must be the SHA-256 hash of the plain token");
  assert.notStrictEqual(testUser.resetPasswordToken, plainToken, "The database must NOT store the plain text token");

  console.log("✅ Password reset token hashing verified successfully!");

  // ----------------------------------------------------
  // TEST 2: Password Reset Execution (resetPassword)
  // ----------------------------------------------------
  console.log("\nTesting password reset execution...");

  const reqReset = {
    body: {
      token: plainToken, // Presenting the plain token
      newPassword: "myNewSecurePassword123"
    }
  };

  let resStatusReset = 200;
  let resJsonReset = null;
  const resReset = {
    status: (s) => {
      resStatusReset = s;
      return {
        json: (j) => {
          resJsonReset = j;
        }
      };
    }
  };

  await authController.resetPassword(reqReset, resReset);

  assert.strictEqual(resStatusReset, 200, "Reset password should succeed with 200 OK");
  assert.ok(resJsonReset.success, "Reset password response should indicate success");
  assert.strictEqual(testUser.resetPasswordToken, undefined, "Reset token should be cleared after successful reset");
  assert.strictEqual(testUser.resetPasswordExpires, undefined, "Reset expiry should be cleared after successful reset");

  console.log("✅ Password reset execution verified successfully!");

  // ----------------------------------------------------
  // TEST 3: Secure Cookies (loginUser / logoutUser)
  // ----------------------------------------------------
  console.log("\nTesting secure cookie settings...");

  // Mock req / res for login
  const reqLogin = {
    body: {
      email: "test@example.com",
      password: "wrongpassword"
    }
  };

  // Mock bcrypt.compare to bypass password checks
  const bcrypt = require("bcryptjs");
  const originalCompare = bcrypt.compare;
  bcrypt.compare = async () => true;

  // Let's set NODE_ENV to production and test
  process.env.NODE_ENV = "production";

  let cookieOptionsProduction = null;
  const resLoginProduction = {
    cookie: (name, token, options) => {
      if (name === "token") {
        cookieOptionsProduction = options;
      }
      return {
        json: () => {}
      };
    },
    status: (s) => {
      return {
        json: () => {}
      };
    }
  };

  await authController.loginUser(reqLogin, resLoginProduction);
  assert.ok(cookieOptionsProduction, "Should set token cookie in production");
  assert.strictEqual(cookieOptionsProduction.secure, true, "Cookie secure option must be true in production");

  // Let's set NODE_ENV to development/other and test
  process.env.NODE_ENV = "development";
  let cookieOptionsDevelopment = null;
  const resLoginDevelopment = {
    cookie: (name, token, options) => {
      if (name === "token") {
        cookieOptionsDevelopment = options;
      }
      return {
        json: () => {}
      };
    },
    status: (s) => {
      return {
        json: () => {}
      };
    }
  };

  await authController.loginUser(reqLogin, resLoginDevelopment);
  assert.ok(cookieOptionsDevelopment, "Should set token cookie in development");
  assert.strictEqual(cookieOptionsDevelopment.secure, false, "Cookie secure option must be false in development");

  // Clean up
  bcrypt.compare = originalCompare;

  console.log("✅ Secure cookie options verified successfully!");

  console.log("\n🎉 All security verification tests passed successfully!");
}

runTests().catch(err => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});
