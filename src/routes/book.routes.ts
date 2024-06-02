import { Router } from "express";
import {
  createBook,
  deleteBookById,
  getAllBooks,
  getBookById,
  updateBookById,
} from "../controllers/book.controller";
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

// Update Book
bookRouter.route("/:bookId").patch(authenticateUser, updateBookById);

// Get all Books
bookRouter.route("/").get(getAllBooks);

// Get Single Book By Id
bookRouter.route("/:bookId").get(getBookById);

// Delete Book
bookRouter.route("/:bookId").delete(authenticateUser, deleteBookById);

export default bookRouter;
