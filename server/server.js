import dotenv from "dotenv";
import app from "./src/app.js";
import connectDB from "./src/db/db.js";

dotenv.config();

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await connectDB();

    console.log("✅ MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log("");
      console.log("======================================");
      console.log("🚀 HireFlow Server Started");
      console.log("======================================");
      console.log(`📡 Server: http://localhost:${PORT}`);
      console.log(`❤️  Health: http://localhost:${PORT}/`);
      console.log("");
      console.log("Available API Routes:");
      console.log(
        `🔐 Auth:          http://localhost:${PORT}/api/auth`
      );
      console.log(
        `🏢 Organizations: http://localhost:${PORT}/api/organizations`
      );
      console.log(
        `💼 Jobs:          http://localhost:${PORT}/api/jobs`
      );
      console.log(
        `👤 Candidates:    http://localhost:${PORT}/api/candidates`
      );
      console.log(
        `📋 Applications:  http://localhost:${PORT}/api/applications`
      );
      console.log("");
      console.log("======================================");
      console.log("HireFlow is ready! 🚀");
      console.log("======================================");
    });
  } catch (error) {
    console.error("❌ SERVER STARTUP FAILED");
    console.error(error.message);

    process.exit(1);
  }
};

process.on("unhandledRejection", (error) => {
  console.error("❌ Unhandled Promise Rejection:");
  console.error(error);

  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:");
  console.error(error);

  process.exit(1);
});

startServer();