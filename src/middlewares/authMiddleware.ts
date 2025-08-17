import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import User from "../models/User.js";

interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;
  const authorization = req.headers.authorization || req.cookies.token;

  if (
    authorization &&
    authorization.startsWith("Bearer")
  ) {
    try {
      token = authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

      req.user = await User.findById(decoded.id).select("-password");

      return next();
    } catch (err) {
      return res.status(401).json({ success: false, message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized, no token" });
  }
};
