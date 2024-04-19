/* eslint-disable indent */
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'


const createNew = async (req, res, next) => {
    const correctCondition = Joi.object({
        ologycode: Joi.string().required().min(1).max(5000).trim().strict(),
        ologyname: Joi.string().required().min(1).max(5000).trim().strict(),
        ologyshort: Joi.string().required().min(1).max(5000).trim().strict(),
        ologydescription: Joi.string().required().min(1).max(5000).trim().strict(),
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
        ologycode: Joi.string().min(1).max(5000).trim().strict(),
        ologyname: Joi.string().min(1).max(5000).trim().strict(),
        ologyshort: Joi.string().min(1).max(5000).trim().strict(),
        ologydescription: Joi.string().min(1).max(5000).trim().strict(),
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

export const ologyValidation = {
    createNew,
    update,
    deleteItem
}