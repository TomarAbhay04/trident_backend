// src/controllers/policyController.js
import Policy from "../models/Policy.js";

export const createPolicy = async (req, res, next) => {
  try {
    const { userId, categoryId, policyNumber, startDate, endDate } = req.body;

    const documentPath = req.file ? `/uploads/${req.file.filename}` : null;

    const policy = await Policy.create({
      user: userId,
      category: categoryId,
      policyNumber,
      startDate,
      endDate,
      documentPath,
    });

    res.status(201).json(policy);
  } catch (err) {
    // Duplicate key error due to unique index (user + policyNumber)
    if (err.code === 11000) {
      return res.status(400).json({
        message: "This policy is already assigned to this user",
      });
    }
    next(err);
  }
};

export const getPolicies = async (req, res, next) => {
  try {
    const policies = await Policy.find()
      .populate("user", "name email")
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.json(policies);
  } catch (err) {
    next(err);
  }
};
