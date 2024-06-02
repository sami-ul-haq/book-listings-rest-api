import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
import { userModel } from "../models/user.model";
import { asyncHandler } from "../utils/asyncHandler";

export interface AuthRequest extends Request {
  userId: String;
}

export const authenticateUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

      if (!token) {
        return next(createHttpError(401, "You're not authorized"));
      }

      const decodedToken = jwt.verify(token, config.jwtSecret as string);

      const user = await userModel
        .findById(decodedToken.sub)
        .select("-password");

      if (!user) {
        return next(createHttpError(401, "Invalid access token"));
      }

      const _req = req as AuthRequest;
      _req.userId = decodedToken.sub as string;
      next();
    } catch (error) {
      return next(createHttpError(401, "Invalid access token"));
    }
  }
);
