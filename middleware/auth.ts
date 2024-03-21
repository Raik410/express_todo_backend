import { Request, Response, NextFunction } from "express";
import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";

interface RequestWithUser extends Request {
  user?: JwtPayload;
}

export const authenticateToken = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const bearer = authHeader && authHeader.split(" ")[0];

  if (!bearer || bearer.toLowerCase() !== 'bearer') {
    return next(new ApiError(401, 'Bearer token not found in the headers'));
  }

  if (!token) {
    return next(new ApiError(401, 'Unauthorized: No token provided'));
  }

  jwt.verify(token, process.env.JWT_SECRET as Secret, (err: any, user: any) => {
    if (err) return next(new ApiError(403, "Forbidden: Token is invalid"));

    req.user = user;
    next();
  });
};
