import express from "express";
import { upload } from "../config/multer.js";
import { protect } from "../middlewares/auth.js";
import {
  addUserStory,
  deleteStory,
  getStories,
  getStoryViewers,
  viewStory,
} from "../controllers/storyContoller.js";

const storyRouter = express.Router();
storyRouter.post("/create", upload.single("media"), protect, addUserStory);
storyRouter.get("/get", protect, getStories);
storyRouter.delete("/delete/:storyId", protect, deleteStory);
storyRouter.post("/view/:storyId", protect, viewStory);
storyRouter.get("/viewers/:storyId", protect, getStoryViewers);

export default storyRouter;
