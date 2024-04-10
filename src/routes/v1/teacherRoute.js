/* eslint-disable indent */
import express from 'express'
import { teacherController } from '~/controllers/teacherController'
import { teacherValidation } from '~/validations/teacherValidation'

const Router = express.Router()

Router.route('/')
    .get(teacherController.getAllTeachers)
    .post(teacherValidation.createNew, teacherController.createNew)

Router.route('/:id')
    .get(teacherController.getDetails)
    .put(teacherValidation.update, teacherController.update)
    .delete(teacherValidation.deleteItem, teacherController.deleteItem)

export const teacherRoute = Router