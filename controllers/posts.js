import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */
export const createPost = async (req, res) => {
  try {
    const {
      userId,
      title,
      description,
      duration,
      category,
      imagePath,
      imageURL,
    } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      author: {
        userId,
        userName: user.userName,
        email: user.email,
      },
      title,
      description,
      duration,
      category,
      imagePath,
      imageURL,
    });
    await newPost.save();

    const post = await Post.find({ userId, title });
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ msg: err.message });
  }
};

/* READ */
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json({ numOfPosts: posts.length, data: posts });
  } catch (err) {
    res.status(404).json({ msg: err.message });
  }
};

export const getPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    const user = await User.findById(post.author.userId);
    res.status(200).json({post, user});
  } catch (err) {
    res.status(404).json({ msg: err.message });
  }
};

// export const getUserPosts = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const post = await Post.find({ userId });
//     res.status(200).json(post);
//   } catch (err) {
//     res.status(404).json({ msg: err.message });
//   }
// };

/* UPDATE */
export const editPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, title, description, duration, category, imagePath, imageURL } =
      req.body;
    const post = await Post.findById(id);

      if (post.author.userId.toString() !== userId) {
        return res
          .status(401)
          .json({ msg: "Authentication Credentials Invalid." });
      }
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { title, description, duration, category, imagePath, imageURL },
      { new: true }
    );

    res.status(200).json({msg: "Post Edited Successfully", data: updatedPost});
  } catch (err) {
    res.status(404).json({ msg: err.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ msg: err.message });
  }
};

/* DELETE */
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    console.log(req.user);

    const post = await Post.findById(id);

    if (post.author.userId.toString() !== userId) {
      return res
        .status(401)
        .json({ msg: "Authentication Credentials Invalid." });
    }
    await Post.findByIdAndDelete(id);

    res.status(200).json({ msg: "Post Deleted Successfully" });
  } catch (err) {
    res.status(404).json({ msg: err.message });
  }
};

