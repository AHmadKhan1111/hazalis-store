const assert = require("assert");
const crypto = require("crypto");
const User = require("./models/User");
const config = require("./config/config");
const authController = require("./controllers/auth/auth-controller");

// Ensure email host is null so nodemailer is bypassed
config.email.host = null;
config.email.user = null;

// Mock JWT_SECRET for JWT generation during login
config.jwtSecret = "mock_jwt_secret_for_testing";
process.env.JWT_SECRET = "mock_jwt_secret_for_testing";

async function runTests() {
  console.log("🔒 Starting Security Verification Tests...\n");

  // TEST 1: Password Reset Token Hashing in forgotPassword
  console.log("Testing password reset token hashing in forgotPassword...");
  {
    let savedToken = null;
    let loggedUrl = null;

    // Mock User.findOne to return a mock user
    const originalFindOne = User.findOne;
    User.findOne = async function(query) {
      return {
        email: "test@example.com",
        userName: "TestUser",
        save: async function() {
          savedToken = this.resetPasswordToken;
        }
      };
    };

    // Capture console.log to extract the raw token from the dev mode output
    const originalLog = console.log;
    console.log = function(...args) {
      const msg = args.join(" ");
      if (msg.includes("FORGOT PASSWORD LINK")) {
        // Extracts the full URL which is printed after 'FORGOT PASSWORD LINK (Dev Mode):'
        loggedUrl = args[args.length - 1] || msg;
      }
      originalLog.apply(console, args);
    };

    const req = { body: { email: "test@example.com" } };
    const res = {
      status: function() { return this; },
      json: function(data) { return this; }
    };

    await authController.forgotPassword(req, res);

    // Restore original methods
    User.findOne = originalFindOne;
    console.log = originalLog;

    assert.ok(loggedUrl, "Should have logged reset URL");
    const urlObj = new URL(loggedUrl);
    const rawToken = urlObj.searchParams.get("token");
    assert.ok(rawToken, "Should have a raw token in the URL");

    const expectedHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    assert.strictEqual(savedToken, expectedHash, "Stored token must be SHA-256 hash of the raw token");
    console.log("✅ TEST 1 PASSED: Password reset token is securely hashed with SHA-256 in MongoDB.\n");
  }

  // TEST 2: Password Reset Hashed Token Lookup in resetPassword
  console.log("Testing password reset token lookup in resetPassword...");
  {
    let queryToken = null;
    const testRawToken = "abcdef123456";

    const originalFindOne = User.findOne;
    User.findOne = async function(query) {
      queryToken = query.resetPasswordToken;
      return null; // Return null so we can exit resetPassword gracefully without full update
    };

    const req = { body: { token: testRawToken, newPassword: "NewPassword123!" } };
    const res = {
      status: function() { return this; },
      json: function(data) { return this; }
    };

    await authController.resetPassword(req, res);

    User.findOne = originalFindOne;

    const expectedHash = crypto.createHash("sha256").update(testRawToken).digest("hex");
    assert.strictEqual(queryToken, expectedHash, "Query must look up the SHA-256 hashed token");
    console.log("✅ TEST 2 PASSED: Password reset uses the SHA-256 hashed token for User lookup.\n");
  }

  // TEST 3: Secure Cookie options in loginUser and logoutUser
  console.log("Testing secure cookie options...");
  {
    const originalNodeEnv = process.env.NODE_ENV;

    // We need mock bcrypt and jwt responses to make loginUser complete
    const originalCompare = require("bcryptjs").compare;
    require("bcryptjs").compare = async () => true;

    const originalFindOne = User.findOne;
    User.findOne = async function() {
      return {
        _id: "mock_id",
        role: "user",
        email: "test@example.com",
        userName: "TestUser",
        password: "hashed_password"
      };
    };

    try {
      // 3a. Production Mode
      process.env.NODE_ENV = "production";
      let loginCookieOptions = null;
      let logoutCookieOptions = null;

      let loginRes = {
        cookie: function(name, val, options) {
          if (name === "token") loginCookieOptions = options;
          return this;
        },
        status: function() { return this; },
        json: function() { return this; }
      };

      let logoutRes = {
        clearCookie: function(name, options) {
          if (name === "token") logoutCookieOptions = options;
          return this;
        },
        status: function() { return this; },
        json: function() { return this; }
      };

      const loginReq = { body: { email: "test@example.com", password: "password" } };
      await authController.loginUser(loginReq, loginRes);
      authController.logoutUser({}, logoutRes);

      assert.ok(loginCookieOptions, "Login cookie options should be captured");
      assert.strictEqual(loginCookieOptions.secure, true, "Cookie secure option should be true in production");
      assert.ok(logoutCookieOptions, "Logout cookie options should be captured");
      assert.strictEqual(logoutCookieOptions.secure, true, "Logout clearCookie secure option should be true in production");

      // 3b. Development Mode
      process.env.NODE_ENV = "development";
      loginCookieOptions = null;
      logoutCookieOptions = null;

      await authController.loginUser(loginReq, loginRes);
      authController.logoutUser({}, logoutRes);

      assert.ok(loginCookieOptions, "Login cookie options should be captured");
      assert.strictEqual(loginCookieOptions.secure, false, "Cookie secure option should be false in development");
      assert.ok(logoutCookieOptions, "Logout cookie options should be captured");
      assert.strictEqual(logoutCookieOptions.secure, false, "Logout clearCookie secure option should be false in development");

      console.log("✅ TEST 3 PASSED: Cookies use secure: true in production and secure: false in development.\n");
    } finally {
      process.env.NODE_ENV = originalNodeEnv;
      User.findOne = originalFindOne;
      require("bcryptjs").compare = originalCompare;
    }
  }

  console.log("🛡️ All security verification tests passed successfully!");
}

runTests().catch(err => {
  console.error("❌ Test Failed:", err);
  process.exit(1);
});
