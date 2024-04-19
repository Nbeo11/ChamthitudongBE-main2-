/* eslint-disable indent */
/* eslint-disable no-useless-catch */
// eslint-disable-next-line quotes
import { StatusCodes } from 'http-status-codes'
import { gradeModel } from '~/models/gradeModel'
import { ologyModel } from '~/models/ologyModel'
import ApiError from '~/utils/ApiError'

const createNew = async (reqBody) => {
    try {
        const newGrade = {
            ...reqBody
        }
        const createdGrade = await gradeModel.createNew(newGrade)
        const getNewGrade = await gradeModel.findOneById(createdGrade.insertedId)

        if (getNewGrade) {
            await ologyModel.pushGradeOrderIds(getNewGrade)
        }
        
        return getNewGrade
    } catch (error) {
        throw error
    }
}

const getAllByOlogyId = async (ologyId) => {
    try {
        // Gọi phương thức từ Model để lấy tất cả các khóa học
        const allGrades = await gradeModel.getAllByOlogyId(ologyId)
        return allGrades
    } catch (error) { throw error }
}

const getAllByCourseAndOlogyId = async (courseId, ologyId) => {
    try {
        const result = await gradeModel.getAllByCourseAndOlogyId(courseId, ologyId);
        return result;

    } catch (error) {
        throw new Error(error);
    }
}

const getAllGrade = async () => {
    try {
        // Gọi phương thức từ Model để lấy tất cả các khóa học
        const allGrades = await gradeModel.getAllGrade()
        return allGrades
    } catch (error) { throw error }
}


const getDetails = async (gradeId) => {
    try {
        const grade = await gradeModel.getDetails(gradeId)
        if (!grade) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Grade not found!')
        }

        return grade
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
        const updatedGrade = await gradeModel.update(id, updateData);
        return updatedGrade
    } catch (error) {
        throw error
    }
}

const deleteItem = async (gradeId) => {
    try {
        const targetGrade = await gradeModel.findOneById(gradeId)
        if (!targetGrade) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Grade not found!')
        }
        // Xóa grade
        await gradeModel.deleteOneById(gradeId)
        // Xóa toàn bộ student thuộc grade

        // Xóa gradeId trong mảng gradeOrderIds trong Course chứa nó

        await ologyModel.pullGradeOrderIds(targetGrade)

        return { deleteResult: 'The grade and its references have been deleted!'}
    } catch (error) {
        throw error
    }
}

export const gradeService = {
    createNew,
    getDetails,
    getAllByOlogyId,
    update,
    deleteItem,
    getAllGrade,
    getAllByCourseAndOlogyId
}