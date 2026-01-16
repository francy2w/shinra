import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  authUser?: { sub: string; role: string };
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "Missing Authorization header" });
  const parts = header.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") return res.status(401).json({ error: "Malformed token" });
  try {
    const payload = jwt.verify(parts[1], process.env.JWT_SECRET!) as any;
    req.authUser = { sub: payload.sub, role: payload.role };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.authUser) return res.status(401).json({ error: "Not authenticated" });
  if (req.authUser.role !== "admin") return res.status(403).json({ error: "Admin role required" });
  next();
}
