import express from "express";
import { createPost, deletePost, editPost, getAllPosts, getPost, likePost } from "../controllers/posts.js";
// import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAllPosts);
router.post("/", createPost);
router.get("/:id", getPost);
router.patch("/:id", editPost);
router.delete("/:id", deletePost);
router.patch("/:id/like", likePost);


export { router };
