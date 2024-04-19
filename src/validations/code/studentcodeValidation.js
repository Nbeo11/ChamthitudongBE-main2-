/* eslint-disable indent */
import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';
import ApiError from '~/utils/ApiError';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';

const createNewStudentCode = async (req, res, next) => {
    const correctCondition = Joi.object({
        student_examId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
        question_bankId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
        sourceCode: Joi.string().required().min(1).trim().strict(),
        scoregot: Joi.number().min(0),
        output: Joi.array().items(
            Joi.object({
                input: Joi.string(),
                executionOutput: Joi.string().required().min(1).max(5000).trim().strict(),
                expectedOutput: Joi.string().required().min(1).max(5000).trim().strict(),
                executionError: Joi.string().allow(''),
                check: Joi.boolean().default(false),
                score: Joi.number().required().min(0),
            })
        ).min(1),
        startedAt: Joi.date().timestamp('javascript'),
        completedAt: Joi.date().timestamp('javascript'),
        executionTime:  Joi.string().min(0).max(5000).trim().strict(),

    });

    try {
        await correctCondition.validateAsync(req.body, { abortEarly: false });
        next();
    } catch (error) {
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message));
    }
};

const updateStudentCode = async (req, res, next) => {
    const correctCondition = Joi.object({
        student_examId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
        question_bankId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
        sourceCode: Joi.string().min(1).trim().strict(),
        scoregot: Joi.number().min(0),
        output: Joi.array().items(
            Joi.object({
                input: Joi.string(),
                executionOutput: Joi.string().min(1).max(5000).trim().strict(),
                expectedOutput: Joi.string().min(1).max(5000).trim().strict(),
                executionError: Joi.string().allow(''),
                check: Joi.boolean().default(false),
                score: Joi.number().required().min(0),
            })
        ).min(1),
        startedAt: Joi.date().timestamp('javascript'),
        completedAt: Joi.date().timestamp('javascript'),
        executionTime:  Joi.string().min(0).max(5000).trim().strict(),

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

const deleteStudentCode = async (req, res, next) => {
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

export const studentcodeValidation = {
    createNewStudentCode,
    updateStudentCode,
    deleteStudentCode
};
