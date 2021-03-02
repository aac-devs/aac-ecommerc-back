const { Router } = require("express");
const { check } = require("express-validator");

const { existCategoryById } = require("../helpers/db-validators");
const { validateFields } = require("../middlewares/validate-fields");

const categoryController = require("../controllers/category.controller");

const router = Router();

router.get("/", categoryController.getAll);
router.get("/:name", categoryController.getProducts);

router.post(
  "/",
  [check("name", "Name is reqsuired").not().isEmpty(), validateFields],
  categoryController.create
);

router.put(
  "/:id",
  [
    check("name", "Name is required").not().isEmpty(),
    check("id").custom(existCategoryById),
    validateFields,
  ],
  categoryController.update
);

router.delete(
  "/:id",
  [check("id").custom(existCategoryById), validateFields],
  categoryController.delete
);

module.exports = router;
