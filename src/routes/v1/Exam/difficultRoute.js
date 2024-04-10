/* eslint-disable indent */
import express from 'express'
import { difficultController } from '~/controllers/Exam/difficultController'
import { difficultValidation } from '~/validations/Exam/difficultValidation'

const Router = express.Router()

Router.route('/')
    .get(difficultController.getAllDifficults)
    .post(difficultValidation.createNew, difficultController.createNew)

Router.route('/:id')
    .get(difficultController.getDetails)
    .put(difficultValidation.update, difficultController.update)
    .delete(difficultValidation.deleteItem, difficultController.deleteItem)
export const difficultRoute = Router