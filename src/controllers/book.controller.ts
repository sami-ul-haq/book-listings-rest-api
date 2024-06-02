import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import createHttpError from "http-errors";
import cloudinary from "../../utils/cloudinary";
import path from "path";
import { bookModel } from "../models/book.model";
import fs from "fs";
import { AuthRequest } from "../middlewares/auth.middleware";

const createBook = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, author, genre } = req.body;

    const files = req.files as { [fieldName: string]: Express.Multer.File[] };

    const coverImageType = files.coverImage[0].mimetype.split("/").at(-1);
    const coverImageName = files.coverImage[0].filename;
    const coverImagePath = path.resolve(
      __dirname,
      "../../public/temp",
      coverImageName
    );

    const pdfFileName = files.coverImage[0].filename;
    const pdfFilePath = path.resolve(
      __dirname,
      "../../public/temp",
      pdfFileName
    );

    const coverImageUploadResult = await cloudinary.uploader.upload(
      coverImagePath,
      {
        filename_override: coverImageName,
        folder: "book-covers",
        format: coverImageType,
      }
    );

    const pdfUploadResult = await cloudinary.uploader.upload(pdfFilePath, {
      resource_type: "raw",
      filename_override: pdfFileName,
      folder: "book-pdfs",
      format: "pdf",
    });

    const _req = req as AuthRequest;

    const newBook = await bookModel.create({
      title,
      author: _req.userId,
      genre,
      coverImage: coverImageUploadResult.secure_url,
      bookFile: pdfUploadResult.secure_url,
    });

    await fs.promises.unlink(coverImagePath);
    await fs.promises.unlink(pdfFilePath);
    // These two line can give you errors

    res.status(201).json({
      message: "Book created successfully",
      id: newBook._id,
    });
  }
);

const updateBookById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
      message: "Book updated successfully",
    });
  }
);

const getAllBooks = asyncHandler(async (req: Request, res: Response) => {
  // Add pagination
  const books = await bookModel.find();

  res.status(200).json({
    message: "All Books",
    books,
  });
});

const getBookById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const bookId = req.params.bookId;

    // const book = await bookModel.findById(bookId);
    const book = await bookModel.findOne({ _id: bookId });

    if (!book) {
      return next(createHttpError(404, "Book NOt FOund"));
    }

    res.status(200).json({
      message: "Book Fetched Successfully",
      book,
    });
  }
);

const deleteBookById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const bookId = req.params.bookId;

    const book = await bookModel.findOne({ _id: bookId });

    if (!book) {
      return next(createHttpError(404, "Book Not Found"));
    }

    // Check Access
    const _req = req as AuthRequest;

    if (book.author.toString() !== _req.userId) {
      return next(
        createHttpError(403, "You don't have permissions to delete this book!")
      );
    }

    const coverFileSplits = book.coverImage.split("/");
    const coverFileId =
      coverFileSplits.at(-2) + "/" + coverFileSplits.at(-1)?.split(".").at(-2);

    const pdfFileSplits = book.bookFile.split("/");
    const pdfFileId = pdfFileSplits.at(-2) + "/" + pdfFileSplits.at(-1);

    await cloudinary.uploader.destroy(coverFileId);
    await cloudinary.uploader.destroy(pdfFileId, {
      resource_type: "raw",
    });

    await bookModel.deleteOne({ _id: bookId });

    res.status(200).json({
      message: "Book deleted successfully",
    });
  }
);

export { createBook, updateBookById, getAllBooks, getBookById, deleteBookById };
