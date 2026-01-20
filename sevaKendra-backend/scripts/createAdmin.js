import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { config } from "dotenv";

config();

const mongoUrl = process.env.MONGO_URL;

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  status: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

async function createAdmin() {
  try {
    await mongoose.connect(mongoUrl);
    console.log("✅ Connected to MongoDB");

    const adminEmail = "admin@sevakendra.com";
    const adminPassword = "Admin@123";

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("❌ Admin user already exists!");
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create admin user
    const admin = new User({
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      status: "active",
    });

    await admin.save();
    console.log("✅ Admin user created successfully!");
    console.log("📧 Email:", adminEmail);
    console.log("🔑 Password:", adminPassword);
    console.log("\n⚠️  Please change the password after first login!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
    process.exit(1);
  }
}

createAdmin();
