/* eslint-disable indent */
/* eslint-disable no-useless-catch */
// eslint-disable-next-line quotes
import { StatusCodes } from 'http-status-codes'
import { departmentModel } from '~/models/departmentModel'
import { teacherModel } from '~/models/teacherModel'
import ApiError from '~/utils/ApiError'

const createNew = async (reqBody) => {
    try {
        const newTeacher = {
            ...reqBody
        }
        const createdTeacher = await teacherModel.createNew(newTeacher)
        const getNewTeacher = await teacherModel.findOneById(createdTeacher.insertedId)

        if (getNewTeacher) {
            await departmentModel.pushTeacherOrderIds(getNewTeacher)
        }
        
        return getNewTeacher
    } catch (error) {
        throw error
    }
}

const getAllTeachers = async () => {
    try {
        // Gọi phương thức từ Model để lấy tất cả các khóa học
        const allTeachers = await teacherModel.getAllTeachers()
        return allTeachers
    } catch (error) { throw error }
}

const getDetails = async (teacherId) => {
    try {
        const teacher = await teacherModel.getDetails(teacherId)
        if (!teacher) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Teacher not found!')
        }

        return teacher
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
        const updatedTeacher = await teacherModel.update(id, updateData);
        return updatedTeacher
    } catch (error) {
        throw error
    }
}

const deleteItem = async (teacherId) => {
    try {
        const targetTeacher = await teacherModel.findOneById(teacherId)
        if (!targetTeacher) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Teacher not found!')
        }
        // Xóa teacher
        await teacherModel.deleteOneById(teacherId)
    

        // Xóa teacherId trong mảng teacherOrderIds trong Faculty chứa nó

        await departmentModel.pullTeacherOrderIds(targetTeacher)

        return { deleteResult: 'The teacher and its references have been deleted!'}
    } catch (error) {
        throw error
    }
}

export const teacherService = {
    createNew,
    getDetails,
    getAllTeachers,
    update,
    deleteItem
}