const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Bearer missing in authorization header." });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.error("\n Error:", err);
      return res.sendStatus(403);
    }
    // req.user = decoded.UserInfo.username;
    req.roles = decoded.UserInfo.roles;
    req.email = decoded.UserInfo.email;
    next();
  });
};

module.exports = { verifyJWT };
