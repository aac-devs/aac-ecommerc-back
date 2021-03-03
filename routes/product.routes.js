const { Router } = require("express");
const { check } = require("express-validator");
const productController = require("../controllers/product.controller");
const customValidations = require("../helpers/custom-validations");
const fileExtensionsValidator = require("../middlewares/file-extensions-validator");

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
  [check("id").custom(customValidations.existProductId), validateFields],
  getOne
);

router.post(
  "/",
  [
    check("name", "Name is required!").not().isEmpty(),
    check("name").custom(customValidations.existProductName),
    check("price", "Price is required!").not().isEmpty(),
    check("stock", "Stock is required!").not().isEmpty(),
    validateFields,
    check("stock").custom(customValidations.isInteger),
    check("price").custom(customValidations.isReal),
    fileExtensionsValidator.isAllowExtension,
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
