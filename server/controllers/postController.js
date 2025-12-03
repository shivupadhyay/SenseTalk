import fs from "fs";
import imagekit from "../config/imageKit.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

// Add Post
export const addPost = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { content, post_type } = req.body;
    const images = req.files;

    let image_urls = [];

    if (images.length) {
      image_urls = await Promise.all(
        images.map(async (image) => {
          const fileBuffer = fs.readFileSync(image.path);
          const response = await imagekit.upload({
            file: fileBuffer,
            fileName: image.originalname,
            folder: "posts",
          });
          const url = imagekit.url({
            path: response.filePath,
            transformation: [
              { quality: "auto" },
              { format: "webp" },
              { width: "512" },
            ],
          });
          return url;
        })
      );
    }
    await Post.create({
      user: userId,
      content,
      image_urls,
      post_type,
    });
    res.json({ success: true, message: "Post Created successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get Posts

export const getFeedPosts = async (req, res) => {
  try {
    const { userId } = req.auth();
    const user = await User.findById(userId);

    // User Connections and followings
    const userIds = [userId, ...user.connections, ...user.following];
    const posts = await Post.find({ user: { $in: userIds } })
      .populate("user")
      .sort({ createdAt: -1 });
    res.json({ success: true, posts });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Like Post

// export const likePost = async (req, res) => {
//   try {
//     const { userId } = req.auth();
//     const { postId } = req.body;

//     const post = await Post.findById(postId);

//     if (post.likes_count.includes(userId)) {
//       post.likes_count = post.likes_count.filter((user) => user !== userId);
//       await post.save();
//       res.json({ success: true, message: "Post unliked" });
//     } else {
//       post.likes_count.push(userId);
//       await post.save();
//       res.json({ success: true, message: "Post Liked" });
//     }
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };

export const likePost = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { postId } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.json({ success: false, message: "Post not found" });
    }

    const alreadyLiked = post.likes_count.includes(userId);

    let updatedPost;

    if (alreadyLiked) {
      // UNLIKE (safe concurrency)
      updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $pull: { likes_count: userId } },
        { new: true }
      );

      return res.json({
        success: true,
        message: "Post unliked",
        likes: updatedPost.likes_count,
      });
    } else {
      // LIKE (safe concurrency)
      updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $addToSet: { likes_count: userId } },
        { new: true }
      );

      return res.json({
        success: true,
        message: "Post liked",
        likes: updatedPost.likes_count,
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// Delete Post

export const deletePost = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { postId } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.json({ success: false, message: "Post not found" });
    }

    // Checking if current user is owner
    if (post.user.toString() !== userId) {
      return res.json({
        success: false,
        message: "You cannot delete someone else post",
      });
    }
    // Delete Post

    await Post.findByIdAndDelete(postId);
    return res.json({
      success: true,
      message: "Post delete successfully",
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// Update the post

export const updatePost = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { postId, content } = req.body;

    //  Get existingImages from request body (may be string or array)
    let existingImages = [];
    if (req.body.existingImages) {
      existingImages = Array.isArray(req.body.existingImages)
        ? req.body.existingImages
        : [req.body.existingImages];
    }

    //  Get new uploaded images from multer
    const newImagesFiles = req.files || [];

    //  Find the post
    const post = await Post.findById(postId);
    if (!post) return res.json({ success: false, message: "Post not found" });

    if (post.user.toString() !== userId)
      return res.json({
        success: false,
        message: "You cannot edit someone else's post",
      });

    //  Upload new images to ImageKit
    let newImageUrls = [];
    if (newImagesFiles.length) {
      newImageUrls = await Promise.all(
        newImagesFiles.map(async (image) => {
          const fileBuffer = fs.readFileSync(image.path);
          const response = await imagekit.upload({
            file: fileBuffer,
            fileName: image.originalname,
            folder: "posts",
          });
          const url = imagekit.url({
            path: response.filePath,
            transformation: [
              { quality: "auto" },
              { format: "webp" },
              { width: "512" },
            ],
          });
          return url;
        })
      );
    }

    //  Merge existing + new images
    const finalImages = [...existingImages, ...newImageUrls];

    //  Update post content, images, and type
    post.content = content;
    post.image_urls = finalImages;
    post.post_type =
      finalImages.length && content
        ? "text_with_image"
        : finalImages.length
        ? "image"
        : "text";

    await post.save();

    return res.json({
      success: true,
      message: "Post updated successfully",
      post,
    });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: error.message });
  }
};

// Toogle Save / Unsave Post

export const toogleSavePost = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { postId } = req.body;

    const post = await Post.findById(postId);
    const user = await User.findById(userId);

    if (!post || !user) {
      return res.json({
        success: false,
        message: "Post or user not found.",
      });
    }
    const alreadySaved = user.saved_posts?.includes(postId);
    if (alreadySaved) {
      // UnSave Post
      user.saved_posts.pull(postId);
      post.saves.pull(userId);

      await post.save();
      await user.save();

      return res.json({
        success: true,
        isSaved: false,
        message: "Post Unsaved",
      });
    } else {
      // Save Post

      user.saved_posts.push(postId);
      post.saves.push(userId);

      await post.save();
      await user.save();

      return res.json({
        success: true,
        isSaved: true,
        message: "Post Saved successfully",
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};
