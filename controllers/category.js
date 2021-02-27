const { response } = require("express");
const Category = require("../models/category");

const createCategory = async (req, res = response) => {
  const { name, description } = req.body;

  const catDB = await Category.create({
    name,
    description,
  });

  res.json({
    name,
    description,
    catDB,
  });
};

module.exports = {
  createCategory,
};
