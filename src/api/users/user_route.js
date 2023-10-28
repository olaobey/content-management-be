const express = require("express");
const authController = require("./user_controller");
const {
    validationRules,
    validate,
  } = require("../../validations/user_validator");
  

const router = express.Router();


router
  .route("/register")
  .post(validationRules(), validate, authController.register);

  router.route("/login").post(authController.login);

  router.route("/forgot").post(authController.forgotPassword,);

  router.route("/getUsers").get(authController.getAllUsers);

  router.route("/getUser/:id").get(authController.getUserById);

  router.route("/reset").post(authController.resetPassword);

  router.route("/remove").delete(authController.logout);


  module.exports = router;
