import express from "express";
import { createUser } from "../controllers/signup";
import { loginUser } from "../controllers/login";
import { verifyUser } from "../controllers/verify";
import { checkAuth } from "../controllers/checkauth";
import { googleOAuth } from "../controllers/google";
import { newUser } from "../controllers/newuser";
const router = express.Router();

router.post("/signup", createUser);
router.post("/login", loginUser);
router.post("/verify", verifyUser);
router.post("/checkauth", checkAuth);
router.post("/google", googleOAuth);
router.post("/newuser", newUser);
export default router;
