/* eslint-disable indent */
/* eslint-disable no-useless-catch */
// eslint-disable-next-line quotes
import { StatusCodes } from 'http-status-codes'
import { student_examModel } from '~/models/Exam/student_examModel'
import ApiError from '~/utils/ApiError'

const createNew = async (reqBody) => {
    try {
        const newStudent_exam = {
            ...reqBody
        }

        
        const createdStudent_exam = await student_examModel.createNew(newStudent_exam)
        const getNewStudent_exam = await student_examModel.findOneById(createdStudent_exam.insertedId)

        
        return getNewStudent_exam
    } catch (error) {
        throw error
    }
}

const findOneByModuleandStudentId = async (moduleId, studentId) => {
    try {
        const result = await student_examModel.findOneByModuleandStudentId(moduleId, studentId);
        return result;

    } catch (error) {
        throw new Error(error);
    }
}

const getAllStudent_exams = async () => {
    try {
        // Gọi phương thức từ Model để lấy tất cả các khóa học
        const allStudent_exams = await student_examModel.getAllStudent_exams()
        return allStudent_exams
    } catch (error) { throw error }
}

const getDetails = async (student_examId) => {
    try {
        const student_exam = await student_examModel.getDetails(student_examId)
        if (!student_exam) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Student_exam not found!')
        }

        return student_exam
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
        const updatedContest = await student_examModel.update(id, updateData);
        console.log ('newquestion: ', reqBody.question)
        return updatedContest;
    } catch (error) {
        throw error;
    }
}


const deleteItem = async (student_examId) => {
    try {
        const targetStudent_exam = await student_examModel.findOneById(student_examId)
        if (!targetStudent_exam) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Student_exam not found!')
        }
        // Xóa student_exam
        await student_examModel.deleteOneById(student_examId)
        // Xóa toàn bộ student thuộc student_exam

        // Xóa student_examId trong mảng student_examOrderIds trong Faculty chứa nó


        return { deleteResult: 'The student_exam and its references have been deleted!'}
    } catch (error) {
        throw error
    }
}

export const student_examService = {
    createNew,
    getDetails,
    getAllStudent_exams,
    update,
    deleteItem,
    findOneByModuleandStudentId
}