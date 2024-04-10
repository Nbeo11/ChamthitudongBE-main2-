/* eslint-disable indent */
/* eslint-disable no-useless-catch */
// eslint-disable-next-line quotes
import { StatusCodes } from 'http-status-codes'
import { departmentModel } from '~/models/departmentModel'
import { studentModel } from '~/models/studentModel'
import { testing_departmentModel } from '~/models/testing_departmentModel'
import ApiError from '~/utils/ApiError'

const createNew = async (reqBody) => {
    try {
        const newTesting_department = {
            ...reqBody
        }
        const createdTesting_department = await testing_departmentModel.createNew(newTesting_department)
        const getNewTesting_department = await testing_departmentModel.findOneById(createdTesting_department.insertedId)

        
        return getNewTesting_department
    } catch (error) {
        throw error
    }
}

const getAllTesting_departments = async () => {
    try {
        // Gọi phương thức từ Model để lấy tất cả các khóa học
        const allTesting_departments = await testing_departmentModel.getAllTesting_departments()
        return allTesting_departments
    } catch (error) { throw error }
}

const getDetails = async (testing_departmentId) => {
    try {
        const testing_department = await testing_departmentModel.getDetails(testing_departmentId)
        if (!testing_department) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Testing_department not found!')
        }

        return testing_department
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
        const updatedTesting_department = await testing_departmentModel.update(id, updateData);
        return updatedTesting_department
    } catch (error) {
        throw error
    }
}

const deleteItem = async (testing_departmentId) => {
    try {
        const targetTesting_department = await testing_departmentModel.findOneById(testing_departmentId)
        if (!targetTesting_department) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Testing_department not found!')
        }
        // Xóa testing_department
        await testing_departmentModel.deleteOneById(testing_departmentId)
        // Xóa toàn bộ student thuộc testing_department

        await studentModel.deleteManyByTesting_departmentId(testing_departmentId)

        // Xóa testing_departmentId trong mảng testing_departmentOrderIds trong Faculty chứa nó

        await departmentModel.pullTesting_departmentOrderIds(targetTesting_department)

        return { deleteResult: 'The testing_department and its references have been deleted!'}
    } catch (error) {
        throw error
    }
}

export const testing_departmentService = {
    createNew,
    getDetails,
    getAllTesting_departments,
    update,
    deleteItem
}