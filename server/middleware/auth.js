const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!verifyToken) {
      return res.status(401).send("Token error");
    }
    req.locals = verifyToken.userId;
    req.userRole = verifyToken.role;
    next();
  } catch (error) {
    return res.status(401).send("Unauthorized: Invalid token");
  }
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.userRole || !roles.includes(req.userRole)) {
      return res.status(403).send("Forbidden: insufficient permissions");
    }
    next();
  };
};

module.exports = { auth, requireRole };
