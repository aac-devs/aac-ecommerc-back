const { request, response } = require("express");
const { Category } = require("../db/models/index");

module.exports = {
  getAll: async (req = request, res = response) => {
    try {
      const { limit = 5, offset = 0 } = req.query;
      const categories = await Category.findAndCountAll({
        offset,
        limit,
      });
      res.json(categories);
    } catch (error) {
      res.status(500).json({
        msg: "Something went wrong trying to access to database!",
        error,
      });
    }
  },

  getProducts: async (req = request, res = response) => {
    try {
      const name = req.params.name.toUpperCase();
      const category = await Category.findOne({
        where: {
          name,
        },
      });
      if (!category) {
        return res
          .status(400)
          .json({ msg: `Category '${name}' doesn't exist en database!` });
      }
      const products = await category.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({
        msg: "Something went wrong trying to access to database!",
        error,
      });
    }
  },

  create: async (req = request, res = response) => {
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
          msg: `Category ${categoryFind.name} already exist in database!`,
        });
      }
      const categorySaved = await Category.create({
        name,
        description,
      });
      res.json(categorySaved);
    } catch (error) {
      res.status(500).json({
        msg: "Something went wrong trying to access to database!",
        error,
      });
    }
  },

  update: async (req = request, res = response) => {
    try {
      const { id } = req.params;
      const name = req.body.name.toUpperCase();
      const description = req.body.description
        ? req.body.description
        : "No description";
      const categoryToUpdate = await Category.findByPk(id);
      // Elimina las relaciones en la tabla intermedia de Productos y Categorias:
      await categoryToUpdate.setProducts([]);
      const categoryUpdated = await categoryToUpdate.update({
        name,
        description,
      });
      res.json(categoryUpdated);
    } catch (error) {
      res.status(500).json({
        msg: "Something went wrong trying to access to database!",
        error,
      });
    }
  },

  delete: async (req = request, res = response) => {
    try {
      const { id } = req.params;
      await Category.destroy({ where: { id } });
      res.json({ msg: "Category deleted sucessfully!" });
    } catch (error) {
      res.status(500).json({
        msg: "Something went wrong trying to access to database!",
        error,
      });
    }
  },
};
