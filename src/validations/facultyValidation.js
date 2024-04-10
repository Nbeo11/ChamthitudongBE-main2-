/* eslint-disable indent */
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'


const createNew = async (req, res, next) => {
    const correctCondition = Joi.object({
        facultyname: Joi.string().required().min(1).max(50).trim().strict()
    })

    try {
        //abortEarly: dùng để check xem validate có dừng sớm k hay là xét hết các trường
        await correctCondition.validateAsync(req.body, { abortEarly: false })
        
        //Validate dữ liệu xong xuôi hợp lệ thì cho request đi tiếp sang Controller
        next()
    } catch (error) {
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
    }

}


const update = async (req, res, next) => {
    //Lưu ý không dùng hàm require trong trường hợp update
    const correctCondition = Joi.object({
        facultyname: Joi.string().min(1).max(50).trim().strict()
    })

    try {
        //abortEarly: dùng để check xem validate có dừng sớm k hay là xét hết các trường
        // Đối với trường hợp uo
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

export const facultyValidation = {
    createNew,
    update,
    deleteItem
}
