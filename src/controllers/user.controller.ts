import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { userModel } from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
import { asyncHandler } from "../../utils/asyncHandler";

// Register
const createUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return next(createHttpError(400, "All fields are required"));
    }

    //   Database Call
    const user = await userModel.findOne({ email });

    if (user) {
      return next(createHttpError(400, "User already exists with this email"));
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

    res.status(201).json({
      message: "User Registered Successfully",
      accessToken: token,
    });
  }
);

// Login
const loginUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(createHttpError(400, "All Fields Required"));
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return next(createHttpError(400, "User Not Found"));
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return next(createHttpError(400, "Email or Password Incorrect"));
    }

    //   Token generation
    const token = jwt.sign({ sub: user._id }, config.jwtSecret as string, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "OK",
      accessToken: token,
    });
  }
);

export { createUser, loginUser };
