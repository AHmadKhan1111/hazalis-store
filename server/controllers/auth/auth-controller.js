const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const config = require("../../config/config");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

//register
const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (checkUser)
      return res.json({
        success: false,
        message: "User Already exists with the same email! Please try again",
      });

    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      userName,
      email,
      password: hashPassword,
    });

    await newUser.save();
    res.status(200).json({
      success: true,
      message: "Registration successful",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

//login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser)
      return res.json({
        success: false,
        message: "User doesn't exists! Please register first",
      });

    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password,
    );
    if (!checkPasswordMatch)
      return res.json({
        success: false,
        message: "Incorrect password! Please try again",
      });

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is not defined!");

    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName,
      },
      config.jwtSecret,
      { expiresIn: "60m" },
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: false, // Allow HTTP (Cloudflare handles SSL)
        sameSite: "Lax",
        maxAge: 60 * 60 * 1000,
      })
      .json({
        success: true,
        message: "Logged in successfully",
        user: {
          email: checkUser.email,
          role: checkUser.role,
          id: checkUser._id,
          userName: checkUser.userName,
        },
      });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

//logout

const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
  }).json({
    success: true,
    message: "Logged out successfully!",
  });
};

//auth middleware
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  console.log("-----------------------------------------");
  console.log("AUTH DEBUG:");
  console.log("Cookies:", req.cookies);
  console.log("Token:", token);
  console.log("Headers:", req.headers);
  console.log("-----------------------------------------");

  if (!token)
    return res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is not defined!");
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User with this email does not exist",
      });
    }

    // Generate a reset token
    const token = crypto.randomBytes(20).toString("hex");
    // Hash token before storing in DB to protect against DB leaks
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.port == 465, // true for 465, false for other ports
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });

    const resetUrl = `${config.clientBaseUrl}/auth/reset-password?token=${token}`;

    const mailOptions = {
      from: config.email.from,
      to: user.email,
      subject: "Password Reset Request - HAZALIS",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #333; text-align: center;">HAZALIS</h2>
          <hr />
          <p>Hi ${user.userName || "Valued Customer"},</p>
          <p>You are receiving this email because you (or someone else) have requested the reset of the password for your account.</p>
          <p>Please click on the following button, or paste the link into your browser to complete the process:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
          </div>
          <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
          <p>This link will expire in 1 hour.</p>
          <hr />
          <p style="font-size: 12px; color: #777;">&copy; 2024 HAZALIS. All rights reserved.</p>
        </div>
      `,
    };

    // If no email config, just log the link (for dev/testing)
    if (!config.email.host || !config.email.user) {
      console.log("-----------------------");
      console.log("FORGOT PASSWORD LINK (Dev Mode):", resetUrl);
      console.log("-----------------------");
      return res.status(200).json({
        success: true,
        message:
          "Development Mode: Reset link generated and logged. In production, this would be sent to your email.",
      });
    }

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message:
        "An e-mail has been sent to " +
        user.email +
        " with further instructions.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error sending reset email",
    });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Hash incoming token to match hashed token stored in DB
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Password reset token is invalid or has expired",
      });
    }

    const hashPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Your password has been successfully updated.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error resetting password",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
  forgotPassword,
  resetPassword,
};
