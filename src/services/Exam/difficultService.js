/* eslint-disable indent */
/* eslint-disable no-useless-catch */
// eslint-disable-next-line quotes
import { StatusCodes } from 'http-status-codes'
import { difficultModel } from '~/models/Exam/difficultModel'
import ApiError from '~/utils/ApiError'

const createNew = async (reqBody) => {
    try {
        const newDifficult = {
            ...reqBody
        }
        const createdDifficult = await difficultModel.createNew(newDifficult)
        const getNewDifficult = await difficultModel.findOneById(createdDifficult.insertedId)

        
        return getNewDifficult
    } catch (error) {
        throw error
    }
}

const getAllDifficults = async () => {
    try {
        // Gọi phương thức từ Model để lấy tất cả các khóa học
        const allDifficults = await difficultModel.getAllDifficults()
        return allDifficults
    } catch (error) { throw error }
}

const getDetails = async (difficultId) => {
    try {
        const difficult = await difficultModel.getDetails(difficultId)
        if (!difficult) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Difficult not found!')
        }

        return difficult
    } catch (error) {
        throw error
    }
}

const update = async (id, reqBody) => {
    try {
        const updateData = {
            ...reqBody,
            updatedAt: Date.now()
        }
        const updatedDifficult = await difficultModel.update(id, updateData);
        return updatedDifficult
    } catch (error) {
        throw error
    }
}

const deleteItem = async (difficultId) => {
    try {
        const targetDifficult = await difficultModel.findOneById(difficultId)
        if (!targetDifficult) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Difficult not found!')
        }
        // Xóa difficult
        await difficultModel.deleteOneById(difficultId)
        // Xóa toàn bộ student thuộc difficult

        // Xóa difficultId trong mảng difficultOrderIds trong Faculty chứa nó


        return { deleteResult: 'The difficult and its references have been deleted!'}
    } catch (error) {
        throw error
    }
}

export const difficultService = {
    createNew,
    getDetails,
    getAllDifficults,
    update,
    deleteItem
}