import mongoose from "mongoose";
import "dotenv/config";
import { User } from "../modules/users/user.models";
import { connectDB } from "../config/database";

const promoteAdmin = async () => {
  const email = process.argv[2];

  if (!email) {
    console.error("Please provide an email: bun run promote-admin.ts <email>");
    process.exit(1);
  }

  try {
    // 1. Connect to DB
    await connectDB();

    // 2. Find and update the user
    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { role: "admin" },
      { new: true }
    );

    if (!user) {
      console.error(`User with email ${email} not found.`);
    } else {
      console.log(`✅ Success! ${user.name} (${user.email}) is now an ADMIN.`);
    }

    // 3. Close connection
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Promotion failed", error);
    process.exit(1);
  }
};

promoteAdmin();
