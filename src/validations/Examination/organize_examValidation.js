/* eslint-disable indent */
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'


const createNew = async (req, res, next) => {
    const correctCondition = Joi.object({
        contestId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    moduleId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    time_countdown: Joi.number().integer().min(0).required(),
    details: Joi.array().items(
        Joi.object({
            ologyId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
            gradeId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
            exam_date: Joi.date().required().iso(),
            exam_start: Joi.date().required(), // Lưu cả ngày và thời gian bắt đầu
            exam_end: Joi.date().required(),
            room: Joi.string().required().min(1).max(50).trim().strict()
        })
    ).min(1).required(),
    })

    try {
        await correctCondition.validateAsync(req.body, { abortEarly: false })
        next()
    } catch (error) {
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
    }

}
const update = async (req, res, next) => {
    const correctCondition = Joi.object({
        contestId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    moduleId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    time_countdown: Joi.number().integer().min(0),
    details: Joi.array().items(
        Joi.object({
            ologyId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
            gradeId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
            exam_date: Joi.date().iso(),
            exam_start: Joi.date(), // Lưu cả ngày và thời gian bắt đầu
            exam_end: Joi.date(),
            room: Joi.string().min(1).max(50).trim().strict()
        })
    ).min(1),
    })

    try {
        await correctCondition.validateAsync(req.body, {
            abortEarly: false,
            allowUnknown: true
        })

        next()
    } catch (error) {
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
    }

}

const deleteItem = async (req, res, next) => {
    const correctCondition = Joi.object({
        id: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    })

    try {
        await correctCondition.validateAsync(req.params)
        next()
    } catch (error) {
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
    }

}

export const organize_examValidation = {
    createNew,
    update,
    deleteItem
}
