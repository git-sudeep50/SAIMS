import jwt,{JwtPayload} from "jsonwebtoken";
import {Request, Response, NextFunction} from "express";

interface AuthenticatedRequest extends Request {
    cookies: {
      token?: string;
    };
    user?: string | JwtPayload;
  }


/**
 * Middleware to verify JWT from HTTPOnly cookies
 */
export const verifyToken = (req:AuthenticatedRequest, res:Response, next:NextFunction):void => {
    const token: string | undefined = req.cookies.token;

  if (!token) {
    res.status(401).json({ message: "Access Denied: No Token Provided" });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or Expired Token" });
    }

    req.user = decoded as JwtPayload; ; 
    next();
  });
};

