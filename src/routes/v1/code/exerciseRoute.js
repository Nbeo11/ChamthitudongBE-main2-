/* eslint-disable indent */
import express from 'express';
import { exerciseController } from '~/controllers/code/exerciseController';
import { exerciseValidation } from '~/validations/code/exerciseValidation';

const Router = express.Router();

Router.route('/')
    .get(exerciseController.getAllExercises)
    .post(exerciseValidation.createNew, exerciseController.createNew);

Router.route('/:id')
    .get(exerciseController.getDetails)
    .put(exerciseValidation.update, exerciseController.update)
    .delete(exerciseValidation.deleteItem, exerciseController.deleteItem);

export const exerciseRoute = Router;
