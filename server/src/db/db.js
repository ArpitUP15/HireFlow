import mongoose from "mongoose";

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is not configured");
  }

  const uri = new URL(mongoUri);

  if (uri.protocol === "mongodb+srv:" && !uri.username) {
    throw new Error(
      "MONGO_URI must include the MongoDB username and password"
    );
  }

  try {
    const connection = await mongoose.connect(mongoUri);

    console.log(
      `MongoDB connected: ${connection.connection.host}`
    );
    
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

db.grantRolesToUser("USERNAME", [
  { role: "readWrite", db: "Login" }
])

export default connectDB;