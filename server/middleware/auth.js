import jwt from "jsonwebtoken";
import "dotenv/config";

export const verifyToken = (req, res, next) => {
  // Extract "Bearer TOKEN"
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { sub, email, iat, exp }
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
};

// Ensures the authenticated user can only act on their own resources
export const verifyOwnership = (req, res, next) => {
  const { userId } = req.params;
  if (req.user.sub !== userId) {
    return res.status(403).json({ message: "Forbidden - Not your resource" });
  }
  next();
};
