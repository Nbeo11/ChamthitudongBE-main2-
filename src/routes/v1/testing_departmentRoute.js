/* eslint-disable indent */
import express from 'express'
import { testing_departmentController } from '~/controllers/testing_departmentController'
import { testing_departmentValidation } from '~/validations/testing_departmentValidation'

const Router = express.Router()

Router.route('/')
    .get(testing_departmentController.getAllTesting_departments)
    .post(testing_departmentValidation.createNew, testing_departmentController.createNew)

Router.route('/:id')
    .get(testing_departmentController.getDetails)

export const testing_departmentRoute = Router