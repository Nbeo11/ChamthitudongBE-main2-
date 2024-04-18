/* eslint-disable indent */
/* eslint-disable no-useless-catch */
// eslint-disable-next-line quotes
import { StatusCodes } from 'http-status-codes'
import { ologyModel } from '~/models/ologyModel'
import ApiError from '~/utils/ApiError'

const createNew = async (reqBody) => {
    try {
        const newOlogy = {
            ...reqBody
        }
        const createdOlogy = await ologyModel.createNew(newOlogy)
        const getNewOlogy = await ologyModel.findOneById(createdOlogy.insertedId)

        return getNewOlogy
    } catch (error) {
        throw error
    }
}

const getAllOlogies = async () => {
    try {
        // Gọi phương thức từ Model để lấy tất cả các khóa học
        const allOlogies = await ologyModel.getAllOlogies()
        return allOlogies
    } catch (error) { throw error }
}

const getDetails = async (ologyId) => {
    try {
        const ology = await ologyModel.getDetails(ologyId);
        if (!ology) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Ology not found!');
        }

        return ology;
    } catch (error) {
        throw error;
    }
};

const update = async (id, reqBody) => {
    try {
        const updateData = {
            ...reqBody,
            updatedAt: Date.now()
        }
        const updatedOlogy = await ologyModel.update(id, updateData);
        return updatedOlogy
    } catch (error) {
        throw error
    }
}


const deleteItem = async (ologyId) => {
    try {
        const targetOlogy = await ologyModel.findOneById(ologyId)
        if (!targetOlogy) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Ology not found!')
        }
        
        // Xóa ology
        await ologyModel.deleteOneById(ologyId)
        /*
        // Xóa toàn bộ grade thuộc ology

        await gradeModel.deleteManyByGradeId(ologyId)

        // Xóa ologyId trong mảng ologyOrderIds trong Course chứa nó

        await courseModel.pullOlogyOrderIds(targetOlogy)
        */
        return { deleteResult: 'The ology and its references have been deleted!' }
    } catch (error) {
        throw error
    }
}

export const ologyService = {
    createNew,
    getDetails,
    update,
    deleteItem,
    getAllOlogies
}