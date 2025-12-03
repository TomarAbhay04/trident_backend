// src/models/PolicyCategory.js
import mongoose from "mongoose";

const policyCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
  },
  { timestamps: true }
);

const PolicyCategory = mongoose.model("PolicyCategory", policyCategorySchema);

export default PolicyCategory;
