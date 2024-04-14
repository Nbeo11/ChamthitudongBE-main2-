/* eslint-disable indent */
/* eslint-disable no-useless-catch */
// eslint-disable-next-line quotes
import { StatusCodes } from 'http-status-codes'
import { exam_structureModel } from '~/models/Exam/exam_structureModel'
import ApiError from '~/utils/ApiError'

const createNew = async (reqBody) => {
    try {
        const newExam_structure = {
            ...reqBody
        }
        const createdExam_structure = await exam_structureModel.createNew(newExam_structure)
        const getNewExam_structure = await exam_structureModel.findOneById(createdExam_structure.insertedId)

        
        return getNewExam_structure
    } catch (error) {
        throw error
    }
}

const getAllExam_structures = async () => {
    try {
        // Gọi phương thức từ Model để lấy tất cả các khóa học
        const allExam_structures = await exam_structureModel.getAllExam_structures()
        return allExam_structures
    } catch (error) { throw error }
}

const getDetails = async (exam_structureId) => {
    try {
        const exam_structure = await exam_structureModel.getDetails(exam_structureId)
        if (!exam_structure) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Exam_structure not found!')
        }

        return exam_structure
    } catch (error) {
        throw error
    }
}

const getByModuleId = async (moduleId) => {
    try {
        // Lấy tất cả các student thuộc grade
        const examtructure = await exam_structureModel.getByModuleId(moduleId)
        return examtructure;
    } catch (error) {
        // Xử lý lỗi nếu có
        throw error;
    }
}


const update = async (id, reqBody) => {
    try {
        const updateData = {
            ...reqBody,
            updatedAt: Date.now()
        }
        const updatedExam_structure = await exam_structureModel.update(id, updateData);
        return updatedExam_structure
    } catch (error) {
        throw error
    }
}

const deleteItem = async (exam_structureId) => {
    try {
        const targetExam_structure = await exam_structureModel.findOneById(exam_structureId)
        if (!targetExam_structure) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Exam_structure not found!')
        }
        // Xóa exam_structure
        await exam_structureModel.deleteOneById(exam_structureId)
        // Xóa toàn bộ student thuộc exam_structure

        // Xóa exam_structureId trong mảng exam_structureOrderIds trong Faculty chứa nó


        return { deleteResult: 'The exam_structure and its references have been deleted!'}
    } catch (error) {
        throw error
    }
}

export const exam_structureService = {
    createNew,
    getDetails,
    getAllExam_structures,
    update,
    deleteItem,
    getByModuleId
}