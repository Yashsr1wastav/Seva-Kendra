import mongoose from "mongoose";
import { config } from "dotenv";

config();

const mongoUrl = process.env.MONGODB_URI || process.env.MONGO_URL;

// Define minimal schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  role: String,
  status: String,
  permissions: [String],
  lastLogin: Date,
}, { timestamps: true, strict: false });

const User = mongoose.model("User", userSchema);

// Default admin permissions
const DEFAULT_ADMIN_PERMISSIONS = [
  "health:view", "health:create", "health:edit", "health:delete", "health:export",
  "education:view", "education:create", "education:edit", "education:delete", "education:export",
  "socialJustice:view", "socialJustice:create", "socialJustice:edit", "socialJustice:delete", "socialJustice:export",
  "users:view", "users:create", "users:edit", "users:delete",
  "reports:view", "reports:export",
];

async function fixAdmin() {
  try {
    await mongoose.connect(mongoUrl);
    console.log("✅ Connected to MongoDB");

    const admin = await User.findOne({ email: "admin@sevakendra.com" });
    
    if (!admin) {
      console.log("❌ No admin found");
      process.exit(1);
    }

    console.log("Found admin:", admin._id);
    console.log("Current firstName:", admin.firstName);
    console.log("Current lastName:", admin.lastName);
    console.log("Current permissions:", admin.permissions?.length || 0, "permissions");

    // Update admin with missing fields
    const result = await User.updateOne(
      { email: "admin@sevakendra.com" },
      {
        $set: {
          firstName: admin.firstName || "Admin",
          lastName: admin.lastName || "User",
          permissions: DEFAULT_ADMIN_PERMISSIONS,
          status: "active"
        }
      }
    );

    console.log("\n✅ Admin updated!");
    console.log("Modified:", result.modifiedCount);
    
    // Verify
    const updated = await User.findOne({ email: "admin@sevakendra.com" });
    console.log("\n📋 Updated Admin:");
    console.log("  Email:", updated.email);
    console.log("  Name:", updated.firstName, updated.lastName);
    console.log("  Role:", updated.role);
    console.log("  Status:", updated.status);
    console.log("  Permissions:", updated.permissions?.length, "permissions");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

fixAdmin();
