export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.userRole; // gán từ verifyToken

    if (!allowedRoles.includes(userRole)) {
      console.warn("❗ Authorization failed:");
      console.warn("  - Required roles:", allowedRoles);
      console.warn("  - Current user role:", userRole);
      return res
        .status(403)
        .json({ message: "Forbidden: insufficient permissions" });
    }

    next();
  };
};
