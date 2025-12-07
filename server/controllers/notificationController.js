import React from "react";
import Post from "../models/Post.js";

export const getNotificationController = async (req, res) => {
  try {
    const { userId } = req.auth();

    const posts = await Post.find({ user: userId })
      .populate("likes_count", "username full_name profile_picture")
      .select("likes_count createdAt image_urls");

    const notificationLikes = posts.flatMap((post) =>
      post.likes_count
        .filter((user) => user._id.toString() !== userId)
        .map((user) => ({
          postId: post._id,
          userId: user._id,
          username: user.username,
          full_name: user.full_name,
          profile_picture: user.profile_picture,
          postThumbnail: post.image_urls?.[0] || null,
          type: "LIKE",
          createdAt: post.createdAt,
        }))
    );
    notificationLikes.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return res.json({
      success: true,
      notificationLikes,
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};
