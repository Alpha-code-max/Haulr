import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    // Attempt standard connection to Atlas but explicitly prioritize IPv4
    // which bypasses strict 'querySrv ECONNREFUSED' DNS issues commonly found in Mongoose setups.
    await mongoose.connect(process.env.MONGO_URI!, { family: 4 });
    console.log("✅ MongoDB connected via Atlas");
  } catch (error) {
    console.error("❌ MongoDB Atlas connection failed", error);
    process.exit(1);
  }
};
