import dotenv from "dotenv";
import http from "http";

import app from "./src/app.js";
import connectDB from "./src/db/db.js";
import {
  initializeSocket,
} from "./src/socket.js";

dotenv.config();

const PORT =
  process.env.PORT || 5001;

const startServer = async () => {
  try {
    await connectDB();

    const server = http.createServer(app);

    initializeSocket(server);

    server.listen(PORT, () => {
      console.log(
        `🚀 HireFlow server running on port ${PORT}`
      );

      console.log(
        `http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Failed to start server:",
      error.message
    );

    process.exit(1);
  }
};

startServer();