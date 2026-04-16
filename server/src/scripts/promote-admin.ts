import mongoose from "mongoose";
import "dotenv/config";
import { User } from "../modules/users/user.models";
import { connectDB } from "../config/database";

const promoteAdmin = async () => {
  const email = process.argv[2];
  const roleArg = process.argv[3]; // optional: --role=super_admin
  const role = roleArg?.startsWith("--role=") ? roleArg.split("=")[1] : "admin";

  if (!email) {
    console.error("Usage: npm run promote-admin <email> [--role=admin|super_admin]");
    process.exit(1);
  }

  if (!["admin", "super_admin"].includes(role)) {
    console.error(`Invalid role "${role}". Must be "admin" or "super_admin".`);
    process.exit(1);
  }

  try {
    await connectDB();

    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { role },
      { new: true }
    );

    if (!user) {
      console.error(`User with email ${email} not found.`);
    } else {
      console.log(`✅ Success! ${user.name} (${user.email}) is now a ${role.toUpperCase()}.`);
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Promotion failed", error);
    process.exit(1);
  }
};

promoteAdmin();
