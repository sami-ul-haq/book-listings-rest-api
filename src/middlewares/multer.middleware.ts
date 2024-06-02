import { Request } from "express";
import multer, { diskStorage } from "multer";

const storage = diskStorage({
  destination: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) {
    cb(null, "./pulic/temp");
  },
  filename: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) {
    cb(null, file.originalname);
  },
});

export const upload = multer({
  storage,
});
