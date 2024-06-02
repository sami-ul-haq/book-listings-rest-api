import app from "./src/app";
import { config } from "./src/config/config";
import connectDB from "./src/config/db";

const PORT = config.port || 3000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`App is listening on the port http://localhost:${PORT}`);
  });
};

startServer();
