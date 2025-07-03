import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    console.warn("❗ Token missing in Authorization header");
    return res.status(401).json({ message: "Access token is required" });
  }

  jwt.verify(token, process.env.ACCESS_SECRET, (err, decoded) => {
    if (err) {
      console.error(
        "❗ Access token verification failed:",
        err.name,
        "-",
        err.message
      );
      return res
        .status(403)
        .json({ message: "Invalid or expired access token" });
    }

    // ✅ Token còn hạn, lưu thông tin user
    req.userId = decoded.userId;
    req.userRole = decoded.role; // nếu payload có chứa role

    next();
  });
};
