const express = require("express");
const userRoute = require("../api/users/user_route");
const postRoute = require("../api/posts/post_route");
const categoryRoute = require("../api/categories/category_route")

const router = express.Router();


router.use("/user", userRoute);

router.use("/posts", postRoute);

router.use("/categories", categoryRoute)


module.exports = router;