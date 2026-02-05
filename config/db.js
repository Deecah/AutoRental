import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL;
    
    if (!mongoUrl) {
      console.warn("⚠️ MONGO_URL is not defined - skipping MongoDB connection");
      return;
    }

    await mongoose.connect(mongoUrl);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);
    // Don't exit on production, just warn
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
}
