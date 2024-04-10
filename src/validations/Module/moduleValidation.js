/* eslint-disable indent */
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const createNew = async (req, res, next) => {
    const correctCondition = Joi.object({
        modulecode: Joi.string().required().min(1).max(50).trim().strict(),
        modulename: Joi.string().required().min(1).max(50).trim().strict(),
        numofcredit: Joi.string().required().pattern(/^[0-9]{1,2}$/),
        compulsory: Joi.boolean().required(),
        numoftheory: Joi.string().pattern(/^[0-9]{1,2}$/),
        numofpractice: Joi.string().pattern(/^[0-9]{1,2}$/),
        numoftask: Joi.string().pattern(/^[0-9]{1,2}$/),
        numofexam: Joi.string().pattern(/^[0-9]{1,2}$/),
        note: Joi.string().min(1).max(50).trim().strict(),
        moduledescription: Joi.string().min(1).max(50).trim().strict(),
        chapters: Joi.array().items(
            Joi.object({
                chaptername: Joi.string().min(1).max(50).trim().strict(),
                description: Joi.string().min(1).max(255).trim().strict()
            })
        ),
        modulestatus: Joi.number().valid(1, 2, 3).default(1)
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
        modulecode: Joi.string().min(1).max(50).trim().strict(),
        modulename: Joi.string().min(1).max(50).trim().strict(),
        numofcredit: Joi.string().pattern(/^[0-9]{1,2}$/),
        compulsory: Joi.boolean(),
        numoftheory: Joi.string().pattern(/^[0-9]{1,2}$/),
        numofpractice: Joi.string().pattern(/^[0-9]{1,2}$/),
        numoftask: Joi.string().pattern(/^[0-9]{1,2}$/),
        numofexam: Joi.string().pattern(/^[0-9]{1,2}$/),
        note: Joi.string().min(1).max(50).trim().strict(),
        moduledescription: Joi.string().min(1).max(50).trim().strict(),
        chapters: Joi.array().items(
            Joi.object({
                chaptername: Joi.string().min(1).max(50).trim().strict(),
                description: Joi.string().min(1).max(255).trim().strict()
            })
        ),
        modulestatus: Joi.number().valid(1, 2, 3).default(1)
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

export const moduleValidation = {
    createNew,
    update,
    deleteItem
}
