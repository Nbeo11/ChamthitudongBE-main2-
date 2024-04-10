// routes/compileRoute.js

import express from 'express';
import { compileCode } from '~/controllers/code/compileController';

const Router = express.Router();

Router.post('/', compileCode);

export const compileRoute = Router