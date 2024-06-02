import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";

const app = express();

app.get("/", (req, res) => {
  res.json({ mxg: "Wecome to the Book Listings" });
});

// global Error Handler
app.use(globalErrorHandler);

export default app;
