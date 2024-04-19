/* eslint-disable indent */
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'


const createNew = async (req, res, next) => {
    const correctCondition = Joi.object({
        moduleId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
        chapters: Joi.array().items(
            Joi.object({
                chapter: Joi.string()
            })
        ).min(1).required(),
        question_format: Joi.string().valid('Trắc nghiệm', 'Thực hành', 'Lý thuyết').required(),
        difficulty: Joi.string().required().trim().strict(),
        question_detail: Joi.string().required().min(1).trim().strict(),
        inputs: Joi.alternatives().conditional('question_format', {
            is: 'Thực hành',
            then: Joi.array().items(
                Joi.object({
                    input: Joi.string(),
                    testcase: Joi.string().required().min(1).max(5000).trim().strict(),
                    score_percentage: Joi.number().required().min(0).max(100),
                })
            ).min(1).required(),
            otherwise: Joi.array().items(
                Joi.object({
                    input: Joi.string().required(),
                })
            ).min(1).required(),
        }),
        key: Joi.when('question_format', {
            is: 'Trắc nghiệm',
            then: Joi.array().items(Joi.string()).min(1).required(),
            otherwise: Joi.forbidden(),
        }),
        question_bankstatus: Joi.number().valid(1, 2, 3).default(1),
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
        moduleId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
        chapters: Joi.array().items(
            Joi.object({
                chapter: Joi.string()
            })
        ).min(1),
        question_format: Joi.string().valid('Trắc nghiệm', 'Thực hành', 'Lý thuyết'),
        difficulty: Joi.string().trim().strict(),
        question_detail: Joi.string().min(1).trim().strict(),
        inputs: Joi.alternatives().conditional('question_format', {
            is: 'Thực hành',
            then: Joi.array().items(
                Joi.object({
                    input: Joi.string(),
                    testcase: Joi.string().min(1).max(5000).trim().strict(),
                    score_percentage: Joi.number().min(0).max(100),
                })
            ).min(1),
            otherwise: Joi.array().items(
                Joi.object({
                    input: Joi.string(),
                })
            ).min(1),
        }),
        key: Joi.when('question_format', {
            is: 'Trắc nghiệm',
            then: Joi.array().items(Joi.string()).min(1),
            otherwise: Joi.forbidden(),
        }),
        question_bankstatus: Joi.number().valid(1, 2, 3).default(1),
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

export const question_bankValidation = {
    createNew,
    update,
    deleteItem
}
