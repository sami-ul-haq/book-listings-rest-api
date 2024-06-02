import mongoose from "mongoose";
import { config } from "./config";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Connected to the Database");
    });

    mongoose.connection.on("error", (err) => {
      console.log("Error in connecting Database", err);
    });

    mongoose.connect(config.databaseURL as string);
  } catch (error) {
    console.log("Failed to connect to the Database", error);
    process.exit(1);
  }
};

export default connectDB;
