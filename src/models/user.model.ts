import mongoose from "mongoose";
import { User } from "../Types/user.types";

const userSchema = new mongoose.Schema<User>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

export const userModel = mongoose.model<User>("User", userSchema);
