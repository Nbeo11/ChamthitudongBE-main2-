/* eslint-disable indent */
/* eslint-disable no-useless-catch */
// eslint-disable-next-line quotes
import { StatusCodes } from 'http-status-codes'
import { departmentModel } from '~/models/departmentModel'
import { studentModel } from '~/models/studentModel'
import { tranning_departmentModel } from '~/models/tranning_departmentModel'
import ApiError from '~/utils/ApiError'

const createNew = async (reqBody) => {
    try {
        const newTranning_department = {
            ...reqBody
        }
        const createdTranning_department = await tranning_departmentModel.createNew(newTranning_department)
        const getNewTranning_department = await tranning_departmentModel.findOneById(createdTranning_department.insertedId)

        
        return getNewTranning_department
    } catch (error) {
        throw error
    }
}

const getAllTranning_departments = async () => {
    try {
        // Gọi phương thức từ Model để lấy tất cả các khóa học
        const allTranning_departments = await tranning_departmentModel.getAllTranning_departments()
        return allTranning_departments
    } catch (error) { throw error }
}

const getDetails = async (tranning_departmentId) => {
    try {
        const tranning_department = await tranning_departmentModel.getDetails(tranning_departmentId)
        if (!tranning_department) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Tranning_department not found!')
        }

        return tranning_department
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
        const updatedTranning_department = await tranning_departmentModel.update(id, updateData);
        return updatedTranning_department
    } catch (error) {
        throw error
    }
}

const deleteItem = async (tranning_departmentId) => {
    try {
        const targetTranning_department = await tranning_departmentModel.findOneById(tranning_departmentId)
        if (!targetTranning_department) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Tranning_department not found!')
        }
        // Xóa tranning_department
        await tranning_departmentModel.deleteOneById(tranning_departmentId)
        // Xóa toàn bộ student thuộc tranning_department

        await studentModel.deleteManyByTranning_departmentId(tranning_departmentId)

        // Xóa tranning_departmentId trong mảng tranning_departmentOrderIds trong Faculty chứa nó

        await departmentModel.pullTranning_departmentOrderIds(targetTranning_department)

        return { deleteResult: 'The tranning_department and its references have been deleted!'}
    } catch (error) {
        throw error
    }
}

export const tranning_departmentService = {
    createNew,
    getDetails,
    getAllTranning_departments,
    update,
    deleteItem
}