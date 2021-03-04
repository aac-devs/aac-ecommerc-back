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
  [
    check("id").custom(customValidations.existProductId),
    check("name", "Name is required!").not().isEmpty(),
    check("price", "Price is required!").not().isEmpty(),
    check("stock", "Stock is required!").not().isEmpty(),
    validateFields,
    check("stock").custom(customValidations.isInteger),
    check("price").custom(customValidations.isReal),
    fileExtensionsValidator.isAllowExtension,
    validateFields,
  ],
  update
);

router.delete(
  "/:id",
  [check("id").custom(customValidations.existProductId), validateFields],
  remove
);

router.post(
  "/:idProduct/category/:idCategory",
  [
    check("idProduct").custom(customValidations.existProductId),
    check("idCategory").custom(customValidations.existCategoryId),
    validateFields,
  ],
  categoryAdd
);

router.delete(
  "/:idProduct/category/:idCategory",
  [
    check("idProduct").custom(customValidations.existProductId),
    check("idCategory").custom(customValidations.existCategoryId),
    validateFields,
  ],
  categoryRemove
);

module.exports = router;
