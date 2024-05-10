// file: routes/authRoutes.js
import express from 'express';
import { loginUser, updatePassword } from '~/controllers/authController';


const Router = express.Router();

Router.post('/login', loginUser);
Router.put('/updatePassword/:user_id', updatePassword); // Sử dụng method PUT cho việc cập nhật mật khẩu

export const authRoute =Router