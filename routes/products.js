const { Router } = require("express");
const { check } = require("express-validator");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/products");

// const { existCategoryById } = require("../helpers/db-validators");
const { validateFields } = require("../middlewares/validate-fields");

const router = Router();

router.get("/", getAllProducts);

router.get("/:id", getProductById);

router.post(
  "/",
  // [check("name", "Name is required").not().isEmpty(), validateFields],
  createProduct
);

router.put(
  "/:id",
  // [
  //   check("name", "Name is required").not().isEmpty(),
  //   validateFields,
  //   check("id").custom(existCategoryById),
  //   validateFields,
  // ],
  updateProduct
);

router.delete(
  "/:id",
  // [check("id").custom(existCategoryById), validateFields],
  deleteProduct
);

module.exports = router;
