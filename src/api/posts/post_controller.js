const paginate = require("express-paginate");
const Post = require("../../model/post");




//Create new post
const createPost = async (req, res) => {
    try {
      const { title, body } = req.body;
      // Confirm data
      if (!title || !body) {
        return res.status(400).json({
          message: "All fields are required",
          success: false,
        });
      }
      // Check for duplicate title
      const duplicate = await Post.findOne({ title }).lean().exec();
      if (duplicate) {
        return res.status(409).json({
          message: "Duplicate post title",
          success: false,
        });
      }
      // Create a new post
      const newPost = new Post({
        ...req.body,
        createdBy: req.user._id,
      });
      //Save new post
      await newPost.save();
      return res.status(200).json({
        data: newPost,
        message: "Post is successfully created",
        success: true,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Server error",
        success: false,
      });
    }
  };
  
  //Update the post
  const updatePost = async (req, res) => {
    try {
      const { id, username, title } = req.body;
      // Confirm data
      if (!id || !username || !title) {
        return res.status(400).json({
          message: "All fields are required",
          success: false,
        });
      }
  
      //Look for the Id of the post from the database
      const post = await Post.findById(req.params.id).exec();
      if (!post) {
        return res
          .status(400)
          .json({ message: "Post not found", success: false });
      }
  
      // Check for duplicate title
      const duplicate = await Post.findOne({ title }).lean().exec();
  
      // Allow renaming of the original post
      if (duplicate && duplicate?._id.toString() !== id) {
        res.status(409).json({
          message: "Duplicate post title",
          success: false,
        });
      }
      if (post.username === req.body.username) {
        try {
          //Update the post with the specified Id from the database
          const updatePost = await Post.findByIdAndUpdate(
            req.params.id,
            {
              $set: req.body,
            },
            { new: true }
          );
          res.status(200).json({
            data: updatePost,
            message: "Post successfully updated",
            success: true,
          });
        } catch (err) {
          res.status(500).json({
            message: "Server error",
            success: false,
          });
        }
      } else {
        res.status(401).json("You can update only your post!");
      }
    } catch (err) {
      res.status(500).json({
        message: "Server error",
        success: false,
      });
    }
  };
  
  //Get all the posts
  const getAllPosts = async (req, res) => {
    try {
      // Find all the paginated posts with the title and category from MongoDB
      const [results, itemCount] = await Promise.all([
        Post.find({})
          // .populate("category", "title")
          .sort({ createdAt: -1 })
          .limit(req.query.limit)
          .skip(req.skip)
          .lean()
          .exec(),
        Post.count({}),
      ]);
  
      //Get the pagination of posts
      const pageCount = Math.ceil(itemCount / req.query.limit);
      return res.status(201).json({
        object: "list",
        has_more: paginate.hasNextPages(req)(pageCount),
        data: results,
        pageCount,
        itemCount,
        currentPage: req.query.page,
        // pages: paginate.getArrayPages(req)(3, pageCount, req.query.page),
      });
    } catch (err) {
      return res.status(500).json({
        message: "Server error",
        success: false,
      });
    }
  };
  
  //Get post by Id
  const getPostById = async (req, res) => {
    try {
      //Get Id of the post from the database and update
      const item = await Post.findById(req.params.id);
      if (item) {
        return res.status(200).json(item);
      }
      return res.status(404).json({
        message: "Item not found",
        success: false,
      });
    } catch (err) {
      return res.status(500).json({
        message: "Server error",
        success: false,
      });
    }
  };
  
  // Delete the post
  const deletePost = async (req, res) => {
    try {
      const { id } = req.body;
  
      // Confirm data
      if (!id) {
        return res.status(400).json({
          message: "Post ID required",
          success: false,
        });
      }
  
      // Confirm note exists to delete
      const post = await Post.findById(id).exec();
  
      if (!post) {
        return res.status(400).json({ message: "Post not found" });
      }
  
      const result = await Post.deleteOne();
  
      const data = `Post '${result.title}' with ID ${result._id} deleted`;
  
      res.json({
        data,
        success: true,
      });
    } catch (err) {
      res.status(500).json({
        message: "Server error",
        success: false,
      });
    }
  };
  
  module.exports = {
    createPost,
    deletePost,
    updatePost,
    getAllPosts,
    getPostById,
  };