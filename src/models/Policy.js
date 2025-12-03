// src/models/Policy.js
import mongoose from "mongoose";

const policySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PolicyCategory",
      required: true,
    },
    policyNumber: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    documentPath: { type: String },
    status: {
      type: String,
      enum: ["active", "expired"],
      default: "active",
    },
  },
  { timestamps: true }
);

// ❗ Same user + same policyNumber not allowed
policySchema.index({ user: 1, policyNumber: 1 }, { unique: true });

const Policy = mongoose.model("Policy", policySchema);

export default Policy;
