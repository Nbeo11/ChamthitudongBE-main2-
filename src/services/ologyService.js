/* eslint-disable indent */
/* eslint-disable no-useless-catch */
// eslint-disable-next-line quotes
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { courseModel } from '~/models/courseModel'
import { gradeModel } from '~/models/gradeModel'
import { ologyModel } from '~/models/ologyModel'
import ApiError from '~/utils/ApiError'

const createNew = async (reqBody) => {
    try {
        const newOlogy = {
            ...reqBody
        }
        const createdOlogy = await ologyModel.createNew(newOlogy)
        const getNewOlogy = await ologyModel.findOneById(createdOlogy.insertedId)

        if (getNewOlogy) {
            // Xử lý cấu trúc data ở đây trước khi trả dữ liệu về
            getNewOlogy.grades = []

            //Cập nhật mảng ologyOrderIds trong collection courses
            await courseModel.pushOlogyOrderIds(getNewOlogy)
        }

        return getNewOlogy
    } catch (error) {
        throw error
    }
}

const getAllByCourseId = async (courseId) => {
    try {
        // Gọi phương thức từ Model để lấy tất cả các ngành học của khóa học có _id là courseId
        const allOlogies = await ologyModel.getAllByCourseId(courseId)
        return allOlogies
    } catch (error) {
        throw error
    }
}


const getDetails = async (ologyId) => {
    try {
        const ology = await ologyModel.getDetails(ologyId);
        if (!ology) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Ology not found!');
        }

        const resOlogy = cloneDeep(ology);

        // Check if resOlogy.grades is defined before iterating over it
        if (resOlogy.grades) {
            resOlogy.grades.forEach(grade => {
                grade.students = resOlogy.students.filter(student => student.gradeId.equals(grade._id));
            });
        }

        delete resOlogy.students;

        return resOlogy;
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
        // Xóa toàn bộ grade thuộc ology

        await gradeModel.deleteManyByGradeId(ologyId)

        // Xóa ologyId trong mảng ologyOrderIds trong Course chứa nó

        await courseModel.pullOlogyOrderIds(targetOlogy)

        return { deleteResult: 'The ology and its references have been deleted!' }
    } catch (error) {
        throw error
    }
}

export const ologyService = {
    createNew,
    getDetails,
    getAllByCourseId,
    update,
    deleteItem
}