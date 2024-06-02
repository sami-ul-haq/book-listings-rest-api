import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./routes/user.routes";

const app = express();

app.get("/", (req, res) => {
  res.json({ mxg: "Wecome to the Book Listings" });
});

app.use("/api/users", userRouter);

// global Error Handler
app.use(globalErrorHandler);

export default app;
