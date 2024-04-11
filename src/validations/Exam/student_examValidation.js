/* eslint-disable indent */
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'


const createNew = async (req, res, next) => {
    const correctCondition = Joi.object({
        studentId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
        examId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
        moduleId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
        organize_examId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
        time_countdown: Joi.number().integer().min(0),
        exam_date: Joi.date().iso(),
        exam_start: Joi.date(), // Lưu cả ngày và thời gian bắt đầu
        exam_end: Joi.date(),
        room: Joi.string().min(1).max(50).trim().strict(),
        question: Joi.array().items(
            Joi.object({
                question_bankId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
                question_score: Joi.number().min(0).max(100),
            })
        ).min(1),
        finalscore: Joi.number().min(0).default(0),
        student_examstatus: Joi.number().valid(1, 2, 3).default(1),
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
        studentId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
        examId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
        moduleId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
        organize_examId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
        time_countdown: Joi.number().integer().min(0),
        exam_date: Joi.date().iso(),
        exam_start: Joi.date(), // Lưu cả ngày và thời gian bắt đầu
        exam_end: Joi.date(),
        room: Joi.string().min(1).max(50).trim().strict(),
        question: Joi.array().items(
            Joi.object({
                question_bankId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
                question_score: Joi.number().min(0).max(100),
            })
        ).min(1),
        finalscore: Joi.number().min(0).default(0),
        student_examstatus: Joi.number().valid(1, 2, 3).default(1),
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

export const student_examValidation = {
    createNew,
    update,
    deleteItem
}
