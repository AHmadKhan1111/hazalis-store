const adminMiddleware = (req, res, next) => {
  // user must exist (auth middleware se)
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. Please login first.",
    });
  }

  // role check
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied! Admin rights required.",
    });
  }

  next();
};

module.exports = adminMiddleware;
