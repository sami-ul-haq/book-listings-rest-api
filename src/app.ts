import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./routes/user.routes";
import bookRouter from "./routes/book.routes";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ mxg: "Wecome to the Book Listings" });
});

app.use("/api/users", userRouter);
app.use("/api/books", bookRouter);

// global Error Handler
app.use(globalErrorHandler);

export default app;
