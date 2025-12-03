// src/controllers/policyCategoryController.js
import PolicyCategory from "../models/PolicyCategory.js";

export const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const exists = await PolicyCategory.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await PolicyCategory.create({ name, description });
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await PolicyCategory.find();
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const category = await PolicyCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(category);
  } catch (err) {
    next(err);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    await PolicyCategory.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted" });
  } catch (err) {
    next(err);
  }
};
