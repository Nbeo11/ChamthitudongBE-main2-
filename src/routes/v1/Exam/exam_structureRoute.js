/* eslint-disable indent */
import express from 'express'
import { exam_structureController } from '~/controllers/Exam/exam_structureController'
import { exam_structureValidation } from '~/validations/Exam/exam_structureValidation'

const Router = express.Router()

Router.route('/')
    .get(exam_structureController.getAllExam_structures)
    .post(exam_structureValidation.createNew, exam_structureController.createNew)


Router.route('/module/:moduleId')
    .get(exam_structureController.getByModuleId)

Router.route('/:id')
    .get(exam_structureController.getDetails)
    .put(exam_structureValidation.update, exam_structureController.update)
    .delete(exam_structureValidation.deleteItem, exam_structureController.deleteItem)
export const exam_structureRoute = Router