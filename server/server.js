import dotenv from "dotenv";
import app from "./src/app.js";
import connectDB from "./src/db/db.js";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 HireFlow server running on port ${PORT}`);
      console.log(`📡 Server URL: http://localhost:${PORT}`);
      console.log(`🔐 Authentication APIs: /api/auth`);
      console.log(`🏢 Organization APIs: /api/organizations`);
      console.log(`💼 Job APIs: /api/jobs`);
      console.log(`👤 Candidate APIs: /api/candidates`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Start HireFlow
startServer();