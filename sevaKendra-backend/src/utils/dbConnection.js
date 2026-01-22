import mongoose from "mongoose";

import { appConfig } from "../config/appConfig.js";

const connect = async () => {
  if (mongoose.connection.readyState !== 0) {
    console.log("Already connected to MongoDB");
    return;
  }

  const mongoUrl = appConfig.mongoUrl.replace(/['"]/g, "").trim();

  if (!mongoUrl || mongoUrl.length === 0) {
    console.error(
      "MongoDB URL is not configured. Please check your .env file."
    );
    return;
  }

  try {
    await mongoose.connect(mongoUrl, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      maxPoolSize: 10,
      minPoolSize: 2,
      retryWrites: true,
      w: 'majority'
    });
    console.log("✅ Connected to MongoDB successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    console.log("⚠️  Server will continue running without database connection");
    console.log("⚠️  For Vercel deployment, make sure to:");
    console.log("   1. Go to https://cloud.mongodb.com/");
    console.log("   2. Select your cluster");
    console.log("   3. Go to Network Access");
    console.log("   4. Click 'Add IP Address'");
    console.log("   5. Click 'Allow Access from Anywhere' (0.0.0.0/0)");
    console.log("   6. Add MONGODB_URI to Vercel Environment Variables");
    console.log("   2. Select your cluster");
    console.log("   3. Go to Network Access");
    console.log("   4. Click 'Add IP Address'");
    console.log("   5. Click 'Allow Access from Anywhere' (0.0.0.0/0)");
  }
};

export default connect;
