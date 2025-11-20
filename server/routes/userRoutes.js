import express from "express";
import {
  acceptConnectionRequest,
  discoverUsers,
  FollowUser,
  getUserConnection,
  getUserData,
  getUserProfiles,
  sendConnectionRequest,
  UnfollowUser,
  updateUserData,
} from "../controllers/userController.js";
import { protect } from "../middlewares/auth.js";
import { upload } from "../config/multer.js";
import { Profiler } from "react";

const userRouter = express.Router();

userRouter.get("/data", protect, getUserData);
userRouter.post(
  "/update",
  upload.fields([
    { name: "profile", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  protect,
  updateUserData
);
userRouter.post("/discover", protect, discoverUsers);
userRouter.post("/follow", protect, FollowUser);
userRouter.post("/unfollow", protect, UnfollowUser);
userRouter.post("/connect", protect, sendConnectionRequest);
userRouter.post("/accept", protect, acceptConnectionRequest);
userRouter.get("/connenctions", protect, getUserConnection);
userRouter.get("/profiles", getUserProfiles);

export default userRouter;
