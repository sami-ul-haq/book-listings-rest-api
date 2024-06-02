import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { userModel } from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  // validation
  if (!name || !email || !password) {
    const error = createHttpError(400, "All fields are required");
    return next(error);
  }
  //   database call

  const user = await userModel.findOne({ email });

  if (user) {
    const error = createHttpError(400, "User already exists with this email");
    return next(error);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await userModel.create({
    name,
    email,
    password: hashedPassword,
  });

  res.status(200).json({
    id: newUser._id,
  });
};

export { createUser };
