const { Category, Product } = require("../db/models/index");
const validator = require("validator");

module.exports = {
  existCategoryId: async (id) => {
    const exists = await Category.findByPk(id);
    if (!exists) {
      throw new Error(`Category Id doesn't exist in database!`);
    }
  },
  existProductId: async (id) => {
    const exists = await Product.findByPk(id);
    if (!exists) {
      throw new Error(`Product Id doesn't exist in database!`);
    }
  },
  existProductName: async (name) => {
    name = name.toUpperCase();
    const exist = await Product.findOne({
      where: {
        name,
      },
    });
    if (exist) {
      throw new Error(`Product '${name}' already exist in database! - middle`);
    }
  },
  isInteger: async (value, { req }) => {
    const { body } = req;
    const values = Object.values(body);
    const properties = Object.getOwnPropertyNames(body);
    const index = values.indexOf(value);
    if (!validator.isInt(value + "", { min: 0 })) {
      throw new Error(
        `${properties[index].toUpperCase()} must be an integer positive number!`
      );
    }
  },
  isReal: async (value, { req }) => {
    const { body } = req;
    const values = Object.values(body);
    const properties = Object.getOwnPropertyNames(body);
    const index = values.indexOf(value);
    if (!validator.isFloat(value + "", { min: 0 })) {
      throw new Error(
        `${properties[index].toUpperCase()} must be an positive number!`
      );
    }
  },
};
