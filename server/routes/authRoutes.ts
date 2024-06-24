import express from 'express';
import { createUser } from '../api/signup';

const router = express.Router();

router.post('/signup', createUser);

export default router;