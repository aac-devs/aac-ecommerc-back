const { response } = require("express");
const { Category } = require("../models");

const getAllCategories = async (req, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  const [total, categories] = await Promise.all([
    Category.countDocuments(),
    Category.find().skip(Number(from)).limit(Number(limit)),
  ]);
  res.json({
    total,
    categories,
  });
};

const createCategory = async (req, res = response) => {
  const name = req.body.name.toUpperCase();
  const description = req.body.description
    ? req.body.description
    : "No description";

  const catDB = await Category.findOne({ name });
  if (catDB) {
    return res.status(400).json({
      msg: `Category ${catDB.name} already exist`,
    });
  }
  const category = new Category({ name, description });
  await category.save();
  res.status(201).json(category);
};

const updateCategory = async (req, res = response) => {
  const { id } = req.params;
  const name = req.body.name.toUpperCase();
  const description = req.body.description;
  const catDB = await Category.findByIdAndUpdate(
    id,
    { name, description },
    { new: true }
  );
  res.json(catDB);
};

const deleteCategory = async (req, res = response) => {
  const { id } = req.params;
  const catDB = await Category.findByIdAndDelete(id);
  res.json(catDB);
};

module.exports = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
