import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt.util.js";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    roleId: string;
    roleName: string;
  };
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: "Authorization header missing" });
    return; // functions returning void
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Token missing" });
    return;
  }

  const payload = verifyAccessToken(token);
  if (!payload) {
    res.status(403).json({ message: "Invalid or expired token" });
    return;
  }

  req.user = payload as unknown as AuthRequest["user"]; // Cast to expected type
  next();
};
