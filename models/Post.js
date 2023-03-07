import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    author: {
      userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
      },
      userName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },
    title: {
      type: String,
      required: true,
      min: 6,
    },
    description: {
      type: String,
      required: true,
      min: 6,
    },
    duration: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    imagePath: {
      type: String,
      default: "",
    },
    imageURL: {
      type: String,
      default: "",
    },
    likes: {
      type: Map,
      of: Boolean,
      default: [],
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);

export default Post;
