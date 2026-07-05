import { Router } from "express";
import { getAllChats, createChat, deleteChat } from "../controllers/chat.controllers.ts";
import { isLoggedIn } from "../middleware/auth.middlewares.ts";

const router = Router();

router.route("/:persona").get(isLoggedIn, getAllChats);
router.route("/").post(isLoggedIn, createChat);
router.route("/:id").delete(isLoggedIn, deleteChat);

export default router;