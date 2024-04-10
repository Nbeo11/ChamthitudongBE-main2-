/* eslint-disable indent */
import express from 'express'
import { testController } from '~/controllers/code/testController'
import { testValidation } from '~/validations/code/testValidation'

const Router = express.Router()

Router.route('/')
    .get(testController.getAllTests)
    .post(testValidation.createNew, testController.createNew)

Router.route('/:id')
    .get(testController.getDetails)
    .put(testValidation.update, testController.update)
    .delete(testValidation.deleteItem, testController.deleteItem)
export const testRoute = Router