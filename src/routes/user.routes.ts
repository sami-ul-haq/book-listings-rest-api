import { Router } from "express";
import { createUser, loginUser } from "../controllers/user.controller";

const userRouter = Router();

userRouter.route("/register").post(createUser);
userRouter.route("/login").post(loginUser);

export default userRouter;
