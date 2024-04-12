/* eslint-disable indent */
import express from 'express'
import { student_examController } from '~/controllers/Exam/student_examController'
import { student_examModel } from '~/models/Exam/student_examModel'
import { student_examValidation } from '~/validations/Exam/student_examValidation'

const Router = express.Router()

Router.route('/')
    .get(student_examController.getAllStudent_exams)
    .post(student_examValidation.createNew, student_examController.createNew)
Router.route('/random')
    .post(student_examModel.assignRandomExamToStudent)

Router.route('/:id')
    .get(student_examController.getDetails)
    .put(student_examValidation.update, student_examController.update)
    .delete(student_examValidation.deleteItem, student_examController.deleteItem)
export const student_examRoute = Router