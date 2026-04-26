import mongoose from "mongoose";

import { appConfig } from "../config/appConfig.js";

const connect = async () => {
  if (mongoose.connection.readyState !== 0) {
    console.log("Already connected to MongoDB");
    return;
  }

  const mongoUrl = appConfig.mongoUrl.replace(/['"]/g, "").trim();

  if (!mongoUrl || mongoUrl.length === 0) {
    throw new Error("MongoDB URL is not configured. Please check your .env file.");
  }

  try {
    await mongoose.connect(mongoUrl, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      maxPoolSize: 10,
      minPoolSize: 2,
      retryWrites: true,
      w: "majority"
    });
    console.log("✅ Connected to MongoDB successfully");
  } catch (err) {
    throw new Error(`MongoDB connection error: ${err.message}`);
  }
};

export default connect;
