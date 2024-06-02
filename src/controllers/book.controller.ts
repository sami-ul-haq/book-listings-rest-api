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

export { createBook };
