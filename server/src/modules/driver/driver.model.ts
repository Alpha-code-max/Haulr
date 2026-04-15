import mongoose, { Schema, Document } from "mongoose";

export interface IDriver extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  phone: string;
  status: "available" | "on_delivery";
}

const driverSchema = new Schema<IDriver>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    status: {
      type: String,
      enum: ["available", "on_delivery"],
      default: "available",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IDriver>("Driver", driverSchema);
