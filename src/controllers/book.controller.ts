import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";

const createBook = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export { createBook };
