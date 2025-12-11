import express from "express";
import {
  deleteMessage,
  editMessage,
  getChatMessages,
  sendMessage,
  sseController,
} from "../controllers/messageController.js";
import { upload } from "../config/multer.js";
import { protect } from "../middlewares/auth.js";

const messageRouter = express.Router();

messageRouter.get("/:userId", sseController);
messageRouter.post("/send", upload.single("image"), protect, sendMessage);
messageRouter.post("/get", protect, getChatMessages);
messageRouter.put("/edit", protect, editMessage);
messageRouter.put("/delete", protect, deleteMessage);

export default messageRouter;
