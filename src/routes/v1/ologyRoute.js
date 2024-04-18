/* eslint-disable indent */
import express from 'express'
import { ologyController } from '~/controllers/ologyController'
import { ologyValidation } from '~/validations/ologyValidation'

const Router = express.Router()

Router.route('/')
    .get(ologyController.getAllOlogies)
    .post(ologyValidation.createNew, ologyController.createNew)

Router.route('/:id')
    .get(ologyController.getDetails)
    .put(ologyValidation.update, ologyController.update)
    .delete(ologyValidation.deleteItem, ologyController.deleteItem)


export const ologyRoute = Router