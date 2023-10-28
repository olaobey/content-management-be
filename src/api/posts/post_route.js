const express = require("express");
const postController = require("./post_controller");
const {
  validationRules,
  validate,
} = require("../../validations/post_validator");
const ensuredAuthenticated = require("../../middleware/authentication");


const router = express.Router();


router
  .route("/addPost")
  .post(
    validationRules(),
    validate,
    ensuredAuthenticated,
    postController.createPost
  );

router
  .route("/update/:id")
  .put(ensuredAuthenticated, postController.updatePost);

router.route("/getPosts").get(ensuredAuthenticated, postController.getAllPosts);

router.route("/get/:id").get(ensuredAuthenticated, postController.getPostById);

router
  .route("/remove/:id")
  .delete(ensuredAuthenticated, postController.deletePost);

  

module.exports = router;