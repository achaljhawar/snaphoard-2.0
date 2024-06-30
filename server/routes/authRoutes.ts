import express from "express";
import { createUser } from "../controllers/signup";
import { loginUser } from "../controllers/login";
import { verifyUser } from "../controllers/verify";
import { checkAuth } from "../controllers/checkauth";
const router = express.Router();

router.post("/signup", createUser);
router.post("/login", loginUser);
router.post("/verify", verifyUser);
router.post("/checkauth", checkAuth);

export default router;
