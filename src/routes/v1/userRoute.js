// file: routes/v1/userRoute.js
import express from 'express';
import { updateUserPassword } from '~/controllers/userController';

const router = express.Router();

router.put('/:userId', updateUserPassword);

export default router;
