import express from 'express';
import { createUser } from '../api/signup';
import { loginUser } from '../api/login';
import { verifyUser } from '../api/verify';
const router = express.Router();

router.post('/signup', createUser);
router.post('/login', loginUser);
router.post('/verify', verifyUser);

export default router;