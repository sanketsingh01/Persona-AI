import { Router } from "express";
import { getGoogleRedirectUri, googleLogin, logout, tokenRefresh, getMe } from "../controllers/auth.controllers.ts";
import { isLoggedIn } from "../middleware/auth.middlewares.ts";

const router = Router();

router.route("/google").get(getGoogleRedirectUri);
router.route("/google/callback").get(googleLogin);
router.route("/refreshToken").get(tokenRefresh);
router.route("/getme").get(isLoggedIn, getMe);
router.route("/logout").get(isLoggedIn, logout);

export default router;