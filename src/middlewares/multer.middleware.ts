// import { Request } from "express";
import multer from "multer";
// import multer, { diskStorage } from "multer";
import path from "path";

export const upload = multer({
  dest: path.resolve(__dirname, "../../public/temp"),
  limits: {
    fileSize: 3e7,
  },
});

// const storage = diskStorage({
//   destination: function (
//     req: Request,
//     file: Express.Multer.File,
//     cb: (error: Error | null, destination: string) => void
//   ) {
//     cb(null, path.resolve(__dirname, "../../public/temp"));
//   },
//   filename: function (
//     req: Request,
//     file: Express.Multer.File,
//     cb: (error: Error | null, filename: string) => void
//   ) {
//     cb(null, file.originalname);
//   },
// });

// export const upload = multer({
//   storage,
// });

// Its better to us this fucntion
