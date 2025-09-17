// middleware/auth.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token = null;
  const auth = req.headers.authorization;
  if (auth && auth.startsWith("Bearer ")) token = auth.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "Not authorized, token missing" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user)
      return res.status(401).json({ message: "Invalid token user" });
    next();
  } catch (err) {
    console.error("Auth error", err);
    res.status(401).json({ message: "Token failed" });
  }
};

export const requireRole = (roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });
  const allowed = Array.isArray(roles) ? roles : [roles];
  if (!allowed.includes(req.user.role))
    return res.status(403).json({ message: "Forbidden - insufficient role" });
  next();
};
