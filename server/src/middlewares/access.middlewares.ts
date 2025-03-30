import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    roles: string[];
  };
}

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const token =
        req.cookies.token || req.headers.authorization?.split(" ")[1];
      if (!token) {
        res.status(401).json({ msg: "Unauthorized" });
        return;
      }

      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

      // Check if user has at least one allowed role
      const hasRole = decoded.roles.some((role: string) =>
        allowedRoles.includes(role)
      );
      if (!hasRole) {
        res.status(403).json({ msg: "Forbidden: Insufficient permissions" });
        return;
      }

      (req as AuthenticatedRequest) = decoded;
      next();
    } catch (error) {
      res.status(401).json({ msg: "Invalid or expired token" });
    }
  };
};
