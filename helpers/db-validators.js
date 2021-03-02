// const { Category } = require("../models");
const { Category } = require("../db/models/index");
const { request } = require("express");

const existCategoryById = async (id) => {
  const exists = await Category.findByPk(id);
  if (!exists) {
    throw new Error(`Category Id doesn't exist in database`);
  }
};

const isInteger = (value, field) => {
  if (!Number.isInteger(value)) {
    throw new Error(`${field} isn't an integer value!`);
  }
};

const isNumber = () => {
  // console.log(value);
  // if (Number.isNaN(Number.parseInt(value))) {
  //   throw new Error(` isn't a number!`);
  // }
};

const isPositive = (value, field) => {
  if (value < 0) {
    throw new Error(`${field} isn't a positive number!`);
  }
};

module.exports = {
  existCategoryById,
  isInteger,
  isNumber,
  isPositive,
};
