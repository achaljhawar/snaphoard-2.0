import express from 'express';
import { createUser } from '../api/signup';
import { loginUser } from '../api/login';
const router = express.Router();

router.post('/signup', createUser);
router.post('/login', loginUser);

export default router;