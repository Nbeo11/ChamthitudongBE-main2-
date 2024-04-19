/* eslint-disable indent */
import express from 'express'
import { teaching_groupController } from '~/controllers/Module/teaching_groupController'
import { teaching_groupValidation } from '~/validations/Module/teaching_groupValidation'

const Router = express.Router()

Router.route('/')
    .get(teaching_groupController.getAllTeaching_groups)
    .post(teaching_groupValidation.createNew, teaching_groupController.createNew)

Router.route('/lecturer/:lecturerId')
    .get(teaching_groupController.getTeachingGroupsByLecturer)

Router.route('/module/:moduleId')
    .get(teaching_groupController.findOneByModuleId)

Router.route('/:id')
    .get(teaching_groupController.getDetails)
    .put(teaching_groupValidation.update, teaching_groupController.update)
    .delete(teaching_groupValidation.deleteItem, teaching_groupController.deleteItem)

export const teaching_groupRoute = Router