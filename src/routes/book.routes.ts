import { Router } from "express";
import { createBook } from "../controllers/book.controller";
import { upload } from "../middlewares/multer.middleware";
import { authenticateUser } from "../middlewares/auth.middleware";

const bookRouter = Router();

// Add Book
bookRouter.route("/add-book").post(
  authenticateUser,
  upload.fields([
    {
      name: "coverImage",
      maxCount: 1,
    },
    {
      name: "bookFile",
      maxCount: 1,
    },
  ]),
  createBook
);

export default bookRouter;
