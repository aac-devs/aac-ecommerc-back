const { Router } = require("express");
const { check } = require("express-validator");
const productController = require("../controllers/product.controller");

const {
  existCategoryById,
  isInteger,
  isPositive,
  isNumber,
} = require("../helpers/db-validators");
const { validateFields } = require("../middlewares/validate-fields");

const router = Router();

const {
  getAll,
  getOne,
  create,
  update,
  remove,
  categoryAdd,
  categoryRemove,
} = productController;

router.get("/", getAll);

router.get(
  "/:id",
  [check("id").custom(existCategoryById), validateFields],
  getOne
);

router.post(
  "/",
  [
    check("name", "Name is required!").not().isEmpty(),
    check("price", "Price is required!").not().isEmpty(),
    check("description").custom(isNumber),
    // check("price").custom(isNumber),
    // check("id").custom(existCategoryById),
    // check("price").custom(isPositive),
    // check("stock", "Stock is required!").not().isEmpty(),
    // check("stock").custom(isInteger),
    // check("stock").custom(isPositive),
    validateFields,
  ],
  create
);

router.put(
  "/:id",
  update
  // [
  //   check("name", "Name is required").not().isEmpty(),
  //   validateFields,
  //   check("id").custom(existCategoryById),
  //   validateFields,
  // ],
  // updateProduct
);

router.delete(
  "/:id",
  remove
  // [check("id").custom(existCategoryById), validateFields],
  // deleteProduct
);

router.post("/:idProduct/category/:idCategory", categoryAdd);

router.delete("/:idProduct/category/:idCategory", categoryRemove);

module.exports = router;
