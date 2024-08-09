import express from 'express';
import { loginUser, registerUser } from '../controllers/userController.js';

const userRouter = express.Router();

// Route để đăng ký người dùng mới
userRouter.post('/register', registerUser);

// Route để đăng nhập người dùng
userRouter.post('/login', loginUser);

export default userRouter;
