import jwt from "jsonwebtoken";

const authenticateJWT = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Get token from 'Authorization' header

  if (!token) {
    return res.status(403).json({ error: "Access denied, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, "your_jwt_secret_key");
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(400).json({ error: "Invalid token" });
  }
};

export default authenticateJWT;
