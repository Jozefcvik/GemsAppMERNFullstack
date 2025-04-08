const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  let token;
  try {
    token = req.headers.authorization.split(" ")[1]; // Authorization: 'Bearer TOKEN'
  } catch (err) {
    // If authentication Process FAILED
    return res.status(403).json({ message: "Authentication failed" });
  }

  // If Authentication process is finished but without token
  if (!token) {
    return res.status(403).json({ message: "Authentication failed" });
  }

  const decodedToken = jwt.verify(token, process.env.JWT_KEY);
  req.userData = { userId: decodedToken.userId };
  next();
};
