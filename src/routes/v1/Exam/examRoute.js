/* eslint-disable indent */
import express from 'express'
import { examController } from '~/controllers/Exam/examController'
import { examValidation } from '~/validations/Exam/examValidation'

const Router = express.Router()

Router.route('/')
    .get(examController.getAllExams)
    .post(examValidation.createNew, examController.createNew)

Router.route('/:id')
    .get(examController.getDetails)
    .put(examValidation.update, examController.update)
    .delete(examValidation.deleteItem, examController.deleteItem)
export const examRoute = Router