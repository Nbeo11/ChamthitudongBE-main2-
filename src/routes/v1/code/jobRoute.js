import express from 'express';
import { getJobStatus, runJob } from '~/controllers/code/jobController';

const Router = express.Router();
Router.post('/', runJob);
Router.get('/status', getJobStatus);

export const jobRoute = Router