const { response } = require("express");

const getAllProducts = (req, res = response) => {
  res.json("products - getAll");
};
const getProductById = (req, res = response) => {
  res.json("products - getProductById");
};
const createProduct = (req, res = response) => {
  res.json("products - createProduct");
};
const updateProduct = (req, res = response) => {
  res.json("products - updateProduct");
};
const deleteProduct = (req, res = response) => {
  res.json("products - deleteProduct");
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
