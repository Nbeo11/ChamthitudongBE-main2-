/* eslint-disable indent */
import express from 'express'
import { department_leaderController } from '~/controllers/department_leaderController'
import { department_leaderValidation } from '~/validations/department_leaderValidation'

const Router = express.Router()

Router.route('/')
    .get(department_leaderController.getAllDepartment_leaders)
    .post(department_leaderValidation.createNew, department_leaderController.createNew)

Router.route('/:id')
    .get(department_leaderController.getDetails)
    .put(department_leaderValidation.update, department_leaderController.update)
    .delete(department_leaderValidation.deleteItem, department_leaderController.deleteItem)

export const department_leaderRoute = Router