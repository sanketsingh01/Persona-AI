import { Router } from "express";
import { createMessage, getAllMessages } from "../controllers/messages.controllers.ts";
import { isLoggedIn } from "../middleware/auth.middlewares.ts";

const router = Router();

router.route("/:chatId").get(isLoggedIn, getAllMessages).post(isLoggedIn, createMessage);

export default router;