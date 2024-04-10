/* eslint-disable indent */
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'


const createNew = async (req, res, next) => {
    const correctCondition = Joi.object({
        moduleId: Joi.string().required().min(1).max(50).trim().strict(),
        exam_time: Joi.string().required().pattern(/^[0-9]{1,3}$/),
        exam_format: Joi.string().valid('Trắc nghiệm', 'Thực hành', 'Lý thuyết').required(),
        exam_structure: Joi.array().items(
            Joi.object({
                section: Joi.string().required().min(1).max(50).trim().strict(),
                question: Joi.string().required().min(1).max(100).trim().strict(),
                score: Joi.number().required().min(1),
                chapter: Joi.array().items(
                    Joi.string().required().min(1).max(50).trim().strict()
                ),
                difficulty: Joi.string().trim().strict(),
            })

        ),
        note: Joi.string().min(1).max(50).trim().strict(),
        exam_structurestatus: Joi.number().valid(1, 2, 3).default(1),
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
        moduleId: Joi.string().min(1).max(50).trim().strict(),
        exam_time: Joi.string().pattern(/^[0-9]{1,3}$/),
        exam_format: Joi.string().valid('Trắc nghiệm', 'Thực hành', 'Lý thuyết'),
        exam_structure: Joi.array().items(
            Joi.object({
                section: Joi.string().min(1).max(50).trim().strict(),
                question: Joi.string().min(1).max(100).trim().strict(),
                score: Joi.number().min(1),
                chapter: Joi.array().items(
                    Joi.string().min(1).max(50).trim().strict()
                ),
                difficulty: Joi.string().trim().strict(),
            })

        ),
        note: Joi.string().min(1).max(50).trim().strict(),
        exam_structurestatus: Joi.number().valid(1, 2, 3).default(1),
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

export const exam_structureValidation = {
    createNew,
    update,
    deleteItem
}
