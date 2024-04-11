/* eslint-disable indent */
/* eslint-disable no-useless-catch */
// eslint-disable-next-line quotes
import { StatusCodes } from 'http-status-codes'
import { organize_examModel } from '~/models/Examination/organize_examModel'
import ApiError from '~/utils/ApiError'

const createNew = async (reqBody) => {
    try {
        const newOrganize_exam = {
            ...reqBody
        }
        const createdOrganize_exam = await organize_examModel.createNew(newOrganize_exam)
        const getNewOrganize_exam = await organize_examModel.findOneById(createdOrganize_exam.insertedId)

        
        return getNewOrganize_exam
    } catch (error) {
        throw error
    }
}

const getAllOrganize_exams = async () => {
    try {
        // Gọi phương thức từ Model để lấy tất cả các khóa học
        const allOrganize_exams = await organize_examModel.getAllOrganize_exams()
        return allOrganize_exams
    } catch (error) { throw error }
}

const getDetails = async (organize_examId) => {
    try {
        const organize_exam = await organize_examModel.getDetails(organize_examId)
        if (!organize_exam) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Organize_exam not found!')
        }

        return organize_exam
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
        const updatedOrganize_exam = await organize_examModel.update(id, updateData);
        
        console.log ('newquestion: ', reqBody.question)
        return updatedOrganize_exam;
    } catch (error) {
        throw error;
    }
}

const deleteItem = async (organize_examId) => {
    try {
        const targetOrganize_exam = await organize_examModel.findOneById(organize_examId)
        if (!targetOrganize_exam) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Organize_exam not found!')
        }
        // Xóa organize_exam
        await organize_examModel.deleteOneById(organize_examId)
        // Xóa toàn bộ student thuộc organize_exam

        // Xóa organize_examId trong mảng organize_examOrderIds trong Faculty chứa nó


        return { deleteResult: 'The organize_exam and its references have been deleted!'}
    } catch (error) {
        throw error
    }
}

export const organize_examService = {
    createNew,
    getDetails,
    getAllOrganize_exams,
    update,
    deleteItem
}