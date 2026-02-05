import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    console.log("📦 Using existing MongoDB connection");
    return;
  }

  try {
    const mongoUrl = process.env.MONGO_URL;
    
    if (!mongoUrl) {
      console.warn("⚠️ MONGO_URL is not defined - skipping MongoDB connection");
      return;
    }

    const options = {
      serverSelectionTimeoutMS: 30000, // 30 seconds
      socketTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      maxPoolSize: 10,
      minPoolSize: 2,
      maxIdleTimeMS: 30000,
    };

    await mongoose.connect(mongoUrl, options);
    isConnected = true;
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);
    isConnected = false;
    // Don't exit on production, just warn
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
}
