import { Router } from "express";
import { createBook } from "../controllers/book.controller";
import { upload } from "../middlewares/multer.middleware";

const bookRouter = Router();

// Add Book
bookRouter.post(
  "/add-book",
  upload.fields([
    {
      name: "coverImage",
      maxCount: 1,
    },
    {
      name: "file",
      maxCount: 1,
    },
  ]),
  createBook
);

export default bookRouter;
