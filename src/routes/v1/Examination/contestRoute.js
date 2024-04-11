/* eslint-disable indent */
import express from 'express'
import { contestController } from '~/controllers/Examination/contestController'
import { contestValidation } from '~/validations/Examination/contestValidation'

const Router = express.Router()

Router.route('/')
    .get(contestController.getAllContests)
    .post(contestValidation.createNew, contestController.createNew)

Router.route('/:id')
    .get(contestController.getDetails)
    .put(contestValidation.update, contestController.update)
    .delete(contestValidation.deleteItem, contestController.deleteItem)
export const contestRoute = Router