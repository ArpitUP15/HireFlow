import "dotenv/config";

import app from "./src/app.js";
import connectDB from "./src/db/db.js";

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
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