import { Router } from "express";
import { getAllMessages } from "../controllers/messages.controllers.ts";
import { isLoggedIn } from "../middleware/auth.middlewares.ts";

const router = Router();

router.route("/:chatId").get(isLoggedIn, getAllMessages);

export default router;