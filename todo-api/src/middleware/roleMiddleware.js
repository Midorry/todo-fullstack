export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.userRole; // ta sẽ gán từ middleware verifyToken

    if (!allowedRoles.includes(userRole)) {
      return res.sendStatus(403); // cấm
    }

    next();
  };
};
