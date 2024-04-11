/* eslint-disable indent */
import express from 'express'
import { organize_examController } from '~/controllers/Examination/organize_examController'
import { organize_examValidation } from '~/validations/Examination/organize_examValidation'
const Router = express.Router()

Router.route('/')
    .get(organize_examController.getAllOrganize_exams)
    .post(organize_examValidation.createNew, organize_examController.createNew)

Router.route('/:id')
    .get(organize_examController.getDetails)
    .put(organize_examValidation.update, organize_examController.update)
    .delete(organize_examValidation.deleteItem, organize_examController.deleteItem)
export const organize_examRoute = Router