const { Router } = require("express");
const { check } = require("express-validator");

const categoryController = require("../controllers/category.controller");
const customValidations = require("../helpers/custom-validations");
const { validateFields } = require("../middlewares/validate-fields");

const router = Router();

const { getAll, getProducts, create, update, remove } = categoryController;

router.get("/", getAll);
router.get("/:name", getProducts);
router.post(
  "/",
  [check("name", "Name is required!").not().isEmpty(), validateFields],
  create
);
router.put(
  "/:id",
  [
    check("id").custom(customValidations.existCategoryId),
    check("name", "Name is required!").not().isEmpty(),
    validateFields,
  ],
  update
);
router.delete(
  "/:id",
  [check("id").custom(customValidations.existCategoryId), validateFields],
  remove
);

module.exports = router;
