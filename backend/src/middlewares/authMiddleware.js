import jwt from "jsonwebtoken";
import  User  from "../models/user.js";

export const verifyJwt = async (req, res, next) => {
    
  const token =
    req.cookies?.accessToken ||
    req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(400).json({
      message: "Unauthorized: Token not found",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    const user = await User.findById(decoded._id)
      .select("-password -refreshToken");
      

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized: User not found",
      });
    }
    req.user = user;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired token",
      error: err.message,
    });
  }
};
