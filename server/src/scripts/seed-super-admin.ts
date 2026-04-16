/**
 * Seed the initial super_admin account.
 * Hardcoded: name="alpha", email="alpha@haulr.com"
 * Usage: npm run seed:super-admin -- --password="YourSecurePassword"
 */
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import "dotenv/config";
import { connectDB } from "../config/database";
import { User } from "../modules/users/user.models";

const parseArgs = () => {
  const args: Record<string, string> = {};
  process.argv.slice(2).forEach((arg) => {
    // Support both --password=value and --password value
    const clean = arg.replace(/^--/, "");
    const eqIdx = clean.indexOf("=");
    if (eqIdx !== -1) {
      const key = clean.slice(0, eqIdx);
      const value = clean.slice(eqIdx + 1).replace(/^["']|["']$/g, ""); // strip surrounding quotes
      if (key) args[key] = value;
    }
  });
  return args;
};

const seedSuperAdmin = async () => {
  const args = parseArgs();
  const password = args["password"];

  if (!password) {
    console.error("❌ Password is required: npm run seed:super-admin -- --password=\"YourPassword\"");
    process.exit(1);
  }

  try {
    await connectDB();

    const existing = await User.findOne({ email: "alpha@haulr.com" });
    if (existing) {
      console.log(`⚠️  super_admin already exists: ${existing.email} (role: ${existing.role})`);
      await mongoose.connection.close();
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: "alpha",
      email: "alpha@haulr.com",
      phone: "00000000000",
      password: hashedPassword,
      role: "super_admin",
      kycStatus: "verified",
      isVerified: true,
      vehicleImages: [],
    });

    console.log(`✅ super_admin created: ${user.name} (${user.email})`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedSuperAdmin();
