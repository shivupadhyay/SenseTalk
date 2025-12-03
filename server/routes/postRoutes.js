import express from "express";
import { upload } from "../config/multer.js";
import { protect } from "../middlewares/auth.js";
import {
  addPost,
  deletePost,
  getFeedPosts,
  likePost,
  toogleSavePost,
  updatePost,
} from "../controllers/postController.js";

const postRouter = express.Router();

postRouter.post("/add", upload.array("images", 4), protect, addPost);
postRouter.get("/feed", protect, getFeedPosts);
postRouter.post("/like", protect, likePost);
postRouter.post("/delete", protect, deletePost);
postRouter.put("/update", upload.array("newImages", 10), updatePost);
postRouter.post("/toggle-save", protect, toogleSavePost);

export default postRouter;
