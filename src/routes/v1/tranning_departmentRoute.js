/* eslint-disable indent */
import express from 'express'
import { tranning_departmentController } from '~/controllers/tranning_departmentController'
import { tranning_departmentValidation } from '~/validations/tranning_departmentValidation'

const Router = express.Router()

Router.route('/')
    .get(tranning_departmentController.getAllTranning_departments)
    .post(tranning_departmentValidation.createNew, tranning_departmentController.createNew)

Router.route('/:id')
    .get(tranning_departmentController.getDetails)

export const tranning_departmentRoute = Router