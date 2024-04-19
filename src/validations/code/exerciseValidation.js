/* eslint-disable indent */
import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';
import ApiError from '~/utils/ApiError';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';

const createNew = async (req, res, next) => {
    const correctCondition = Joi.object({
        requirement: Joi.string().required(),
        inputs: Joi.array().items(
            Joi.object({
                input: Joi.string(),
                testcase: Joi.string().required().min(1).max(5000).trim().strict(),
                score_percentage:Joi.string().required().min(1).max(5000).trim().strict()
            })
        ).min(1).required() // Tối thiểu một input
    });

    try {
        await correctCondition.validateAsync(req.body, { abortEarly: false });
        next();
    } catch (error) {
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message));
    }
};

const update = async (req, res, next) => {
    const correctCondition = Joi.object({
        requirement: Joi.string(),
        inputs: Joi.array().items(
            Joi.object({
                input: Joi.string(),
                testcase: Joi.string().min(1).max(5000).trim().strict(),
                score_percentage: Joi.string().min(1).max(5000).trim().strict()
            })
        ).min(1) // Tối thiểu một input
    });

    try {
        await correctCondition.validateAsync(req.body, {
            abortEarly: false,
            allowUnknown: true
        });
        next();
    } catch (error) {
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message));
    }
};

const deleteItem = async (req, res, next) => {
    const correctCondition = Joi.object({
        id: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    });

    try {
        await correctCondition.validateAsync(req.params);
        next();
    } catch (error) {
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message));
    }
};

export const exerciseValidation = {
    createNew,
    update,
    deleteItem
};
