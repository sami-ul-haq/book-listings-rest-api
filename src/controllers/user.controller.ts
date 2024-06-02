import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { userModel } from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config/config";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    const error = createHttpError(400, "All fields are required");
    return next(error);
  }

  //   Database Call
  const user = await userModel.findOne({ email });

  if (user) {
    const error = createHttpError(400, "User already exists with this email");
    return next(error);
  }

  //   Password Hashing
  const hashedPassword = await bcrypt.hash(password, 10);

  //   New user creatiion
  const newUser = await userModel.create({
    name,
    email,
    password: hashedPassword,
  });

  //   Token generation
  const token = jwt.sign({ sub: newUser._id }, config.jwtSecret as string, {
    expiresIn: "7d",
  });

  res.status(200).json({
    accessToken: token,
  });
};

export { createUser };
