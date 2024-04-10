/* eslint-disable indent */
/* eslint-disable no-useless-catch */
// eslint-disable-next-line quotes
import { StatusCodes } from 'http-status-codes'
import { gradeModel } from '~/models/gradeModel'
import { studentModel } from '~/models/studentModel'
import ApiError from '~/utils/ApiError'

const createNew = async (reqBody) => {
    try {
        //Xử lý logic dữ liệu tùy đặc thù dự án
        const newStudent = {
            ...reqBody,
        }

        //Gọi tới tầng Model để xử lý lưu bản ghi newStudent vào trong Database
        const createdStudent = await studentModel.createNew(newStudent)
        // console.log(createdStudent)

        //Lấy bản ghi student sau khi gọi (tùy mục đích dự án mà có cần bước này hay k)
        const getNewStudent = await studentModel.findOneById(createdStudent.insertedId)

        if (getNewStudent) {
            await gradeModel.pushStudentOrderIds(getNewStudent)
        }
        return getNewStudent
    } catch (error) {
        throw error
    }
}

const getDetails = async (studentId) => {
    try {
        const student = await studentModel.getDetails(studentId)
        if (!student) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Student not found!')
        }

        return student
    } catch (error) {
        throw error
    }
}

const getAllStudents = async () => {
    try {
        // Gọi phương thức từ Model để lấy tất cả các khóa học
        const allStudents = await studentModel.getAllStudents()
        return allStudents
    } catch (error) { throw error }
}

const getAllByGradeId = async (gradeId) => {
    try {
        // Gọi phương thức từ Model để lấy tất cả các khóa học
        const allStudents = await studentModel.getAllByGradeId(gradeId)
        return allStudents
    } catch (error) { throw error }
}

const update = async (id, reqBody) => {
    try {
        const updateData = {
            ...reqBody,
            updatedAt: Date.now()
        }
        const updatedStudent = await studentModel.update(id, updateData);
        return updatedStudent
    } catch (error) {
        throw error
    }
}

const deleteItem = async (studentId) => {
    try {
        const targetStudent = await studentModel.findOneById(studentId)
        if (!targetStudent) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Student not found!')
        }
        // Xóa student
        await studentModel.deleteOneById(studentId)

        // Xóa studentId trong mảng studentOrderIds trong Grade chứa nó

        await gradeModel.pullStudentOrderIds(targetStudent)

        return { deleteResult: 'The student and its references have been deleted!'}
    } catch (error) {
        throw error
    }
}

export const studentService = {
    createNew,
    getDetails,
    update,
    deleteItem,
    getAllStudents,
    getAllByGradeId
}