const { Router } = require("express");
const { check } = require("express-validator");
const {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/categories");
const { existCategoryById } = require("../helpers/db-validators");
const { validateFields } = require("../middlewares/validate-fields");

const router = Router();

router.get("/", getAllCategories);

router.post(
  "/",
  [check("name", "Name is required").not().isEmpty(), validateFields],
  createCategory
);

router.put(
  "/:id",
  [
    check("id", `Isn't a valid Mongo ID`).isMongoId(),
    check("name", "Name is required").not().isEmpty(),
    validateFields,
    check("id").custom(existCategoryById),
    validateFields,
  ],
  updateCategory
);

router.delete(
  "/:id",
  [
    check("id", `Isn't a valid Mongo ID`).isMongoId(),
    validateFields,
    check("id").custom(existCategoryById),
    validateFields,
  ],
  deleteCategory
);

module.exports = router;
