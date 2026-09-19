import dotenv from "dotenv";

import app from "./src/app.js";

import connectDB from "./src/db/db.js";


// =====================================================
// ENVIRONMENT VARIABLES
// =====================================================

dotenv.config();


// =====================================================
// PORT
// =====================================================

const PORT =
  process.env.PORT ||
  5001;


// =====================================================
// START SERVER
// =====================================================

const startServer =
  async () => {

    try {

      // -------------------------------------------------
      // Database
      // -------------------------------------------------

      await connectDB();


      // -------------------------------------------------
      // Start Express
      // -------------------------------------------------

      app.listen(
        PORT,
        () => {

          console.log(
            `🚀 HireFlow server running on port ${PORT}`
          );

          console.log(
            `http://localhost:${PORT}`
          );

        }
      );

    } catch (error) {

      console.error(
        "Failed to start server:",
        error.message
      );

      process.exit(1);
    }
  };


// =====================================================
// RUN
// =====================================================

startServer();