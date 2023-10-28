const express = require("express");
const categoryController = require("./category_controller");
const {
  validationRules,
  validate,
} = require("../../validations/category_validator");
const ensuredAuthenticated = require("../../middleware/authentication");


const router = express.Router();


router
  .route("/create")
  .post(
    validationRules(),
    validate,
    ensuredAuthenticated,
    categoryController.addOne
  );

router
  .route("/update/:id")
  .put(ensuredAuthenticated, categoryController.updateOne);

router
  .route("/delete/:id")
  .delete(ensuredAuthenticated, categoryController.removeOne);

router.route("/get").get(ensuredAuthenticated, categoryController.getAll);


module.exports = router;