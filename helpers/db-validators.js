// const { Category } = require("../models");
const { Category } = require("../db/models/index");

const existCategoryById = async (id) => {
  const exists = await Category.findByPk(id);
  if (!exists) {
    throw new Error(`Category Id doesn't exist in database`);
  }
};

module.exports = {
  existCategoryById,
};
