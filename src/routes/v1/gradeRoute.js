/* eslint-disable indent */
import express from 'express'
import { gradeController } from '~/controllers/gradeController'
import { gradeValidation } from '~/validations/gradeValidation'

const Router = express.Router()

Router.route('/')
    .get(gradeController.getAllGrade)
    .post(gradeValidation.createNew, gradeController.createNew)

Router.route('/:ologyId/grades')
    .get(gradeController.getAllByOlogyId);

Router.route('/:id')
    .get(gradeController.getDetails)
    .put(gradeValidation.update, gradeController.update)
    .delete(gradeValidation.deleteItem, gradeController.deleteItem)

export const gradeRoute = Router