/* eslint-disable indent */
import express from 'express'
import { facultyController } from '~/controllers/facultyController'
import { facultyValidation } from '~/validations/facultyValidation'

const Router = express.Router()

Router.route('/')
    .get(facultyController.getAllFaculties)
    .post(facultyValidation.createNew, facultyController.createNew)

Router.route('/:id')
    .get(facultyController.getDetails)
    .put(facultyValidation.update, facultyController.update)
    .delete(facultyValidation.deleteItem, facultyController.deleteItem)

export const facultyRoute = Router