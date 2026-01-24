import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { config } from "dotenv";

config();

const mongoUrl = process.env.MONGODB_URI || process.env.MONGO_URL;

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: String, required: true },
  status: { type: String, required: true },
  permissions: { type: [String], default: [] },
  lastLogin: { type: Date },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

// Default admin permissions
const DEFAULT_ADMIN_PERMISSIONS = [
  "health:view", "health:create", "health:edit", "health:delete", "health:export",
  "education:view", "education:create", "education:edit", "education:delete", "education:export",
  "socialJustice:view", "socialJustice:create", "socialJustice:edit", "socialJustice:delete", "socialJustice:export",
  "users:view", "users:create", "users:edit", "users:delete",
  "reports:view", "reports:export",
];

async function createAdmin() {
  try {
    await mongoose.connect(mongoUrl);
    console.log("✅ Connected to MongoDB");

    const adminEmail = process.env.ADMIN_EMAIL || "admin@sevakendra.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";
    const adminFirstName = process.env.ADMIN_FIRST_NAME || "Admin";
    const adminLastName = process.env.ADMIN_LAST_NAME || "User";

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("❌ Admin user already exists!");
      console.log("📧 Email:", existingAdmin.email);
      console.log(`👤 Name: ${existingAdmin.firstName} ${existingAdmin.lastName}`);
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create admin user
    const admin = new User({
      email: adminEmail.toLowerCase(),
      password: hashedPassword,
      firstName: adminFirstName,
      lastName: adminLastName,
      role: "admin",
      status: "active",
      permissions: DEFAULT_ADMIN_PERMISSIONS,
    });

    await admin.save();
    console.log("\n✅ Admin user created successfully!");
    console.log("=".repeat(50));
    console.log("📧 Email:", adminEmail);
    console.log("🔑 Password:", adminPassword);
    console.log(`👤 Name: ${adminFirstName} ${adminLastName}`);
    console.log("🔐 Role: admin");
    console.log("=".repeat(50));
    console.log("\n⚠️  Please change the password after first login!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
    process.exit(1);
  }
}

createAdmin();
