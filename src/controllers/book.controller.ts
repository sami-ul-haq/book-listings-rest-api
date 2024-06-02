import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import createHttpError from "http-errors";
import cloudinary from "../../utils/cloudinary";
import path from "path";
import { bookModel } from "../models/book.model";
import fs from "fs";

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

    const coverImageUploadResult = await cloudinary.uploader.upload(
      coverImagePath,
      {
        filename_override: coverImageName,
        folder: "book-covers",
        format: coverImageType,
      }
    );

    const pdfFileName = files.coverImage[0].filename;
    const pdfFilePath = path.resolve(
      __dirname,
      "../../public/temp",
      pdfFileName
    );

    const pdfUploadResult = await cloudinary.uploader.upload(pdfFilePath, {
      resource_type: "raw",
      filename_override: pdfFileName,
      folder: "book-pdfs",
      format: "pdf",
    });

    const newBook = await bookModel.create({
      title,
      author: "665c6020b9715fc75186e716",
      genre,
      coverImage: coverImageUploadResult.secure_url,
      bookFile: pdfUploadResult.secure_url,
    });

    await fs.promises.unlink(pdfFilePath);
    await fs.promises.unlink(coverImagePath);

    res.status(201).json({
      message: "Book created successfully",
      id: newBook._id,
    });
  }
);

export { createBook };
