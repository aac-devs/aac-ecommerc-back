const { Router } = require("express");
const { check } = require("express-validator");

const { existCategoryById } = require("../helpers/db-validators");
const { validateFields } = require("../middlewares/validate-fields");

const categoryController = require("../controllers/category.controller");

const router = Router();

const { getAll, getProducts, create, update, remove } = categoryController;

router.get("/", getAll);
router.get("/:name", getProducts);

router.post(
  "/",
  [check("name", "Name is reqsuired").not().isEmpty(), validateFields],
  create
);

router.put(
  "/:id",
  [
    check("name", "Name is required").not().isEmpty(),
    check("id").custom(existCategoryById),
    validateFields,
  ],
  update
);

router.delete(
  "/:id",
  [check("id").custom(existCategoryById), validateFields],
  remove
);

module.exports = router;
