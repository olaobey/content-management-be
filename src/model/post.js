const { Schema, model } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    body: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    categories: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

PostSchema.plugin(uniqueValidator);
module.exports = model("Post", PostSchema);