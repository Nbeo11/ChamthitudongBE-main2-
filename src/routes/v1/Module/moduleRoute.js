import express from 'express'
import { moduleController } from '~/controllers/Module/moduleController'
import { moduleValidation } from '~/validations/Module/moduleValidation'

const Router = express.Router()

Router.route('/')
    .get(moduleController.getAllModules)
    .post(moduleValidation.createNew, moduleController.createNew)

Router.route('/:id')
    .get(moduleController.getDetails)
    .put(moduleValidation.update, moduleController.update)
    .delete(moduleValidation.deleteItem, moduleController.deleteItem)

export const moduleRoute = Router
