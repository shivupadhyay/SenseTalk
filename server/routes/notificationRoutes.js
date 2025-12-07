import express from "express";
import { protect } from "../middlewares/auth.js";
import { getNotificationController } from "../controllers/notificationController.js";

const router = express.Router();
router.get("/likes", protect, getNotificationController);

export default router;
