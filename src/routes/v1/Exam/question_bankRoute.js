/* eslint-disable indent */
import express from 'express'
import { question_bankController } from '~/controllers/Exam/question_bankController'
import { question_bankValidation } from '~/validations/Exam/question_bankValidation'

const Router = express.Router()

Router.route('/')
    .get(question_bankController.getAllQuestion_banks)
    .post(question_bankValidation.createNew, question_bankController.createNew)

Router.route('/:id')
    .get(question_bankController.getDetails)
    .put(question_bankValidation.update, question_bankController.update)
    .delete(question_bankValidation.deleteItem, question_bankController.deleteItem)
export const question_bankRoute = Router