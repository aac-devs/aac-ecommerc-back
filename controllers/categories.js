const { response } = require("express");
// const Category = require("../models/category");

const getAllCategories = async (req, res = response) => {
  const { limit = 5, offset = 0 } = req.query;
  const categories = await Category.findAndCountAll({
    offset,
    limit,
  });
  res.json(categories);
};

const createCategory = async (req, res = response) => {
  try {
    const name = req.body.name.toUpperCase();
    const description = req.body.description
      ? req.body.description
      : "No description";
    const categoryFind = await Category.findOne({
      where: {
        name,
      },
    });
    if (categoryFind) {
      return res.status(400).json({
        msg: `Category ${categoryFind.name} already exist`,
      });
    }
    const categorySaved = await Category.create({
      name,
      description,
    });
    res.json(categorySaved);
  } catch (error) {
    console.log(error);
    res.status(500).json(error.msg);
  }
};

const updateCategory = async (req, res = response) => {
  try {
    const { id } = req.params;
    const name = req.body.name.toUpperCase();
    const description = req.body.description
      ? req.body.description
      : "No description";
    const categoryToUpdate = await Category.findByPk(id);
    // TODO: Eliminar las relaciones en la tabla intermedia de Productos y Categorias
    const categoryUpdated = await categoryToUpdate.update({
      name,
      description,
    });
    res.json(categoryUpdated);
  } catch (error) {
    console.log(error);
    res.status(500).json(error.msg);
  }
};

const deleteCategory = async (req, res = response) => {
  try {
    const { id } = req.params;
    await Category.destroy({ where: { id } });
    res.json({ msg: "Category deleted sucessfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error.msg);
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
