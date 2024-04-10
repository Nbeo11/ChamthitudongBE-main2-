/* eslint-disable indent */
/* eslint-disable no-useless-catch */
// eslint-disable-next-line quotes
import { StatusCodes } from 'http-status-codes'
import { departmentModel } from '~/models/departmentModel'
import { department_leaderModel } from '~/models/department_leaderModel'
import { studentModel } from '~/models/studentModel'
import ApiError from '~/utils/ApiError'

const createNew = async (reqBody) => {
    try {
        const newDepartment_leader = {
            ...reqBody
        }
        const createdDepartment_leader = await department_leaderModel.createNew(newDepartment_leader)
        const getNewDepartment_leader = await department_leaderModel.findOneById(createdDepartment_leader.insertedId)

        // if (getNewDepartment_leader) {
        //     await departmentModel.pushDepartment_leaderOrderIds(getNewDepartment_leader)
        // }
        
        return getNewDepartment_leader
    } catch (error) {
        throw error
    }
}

const getAllDepartment_leaders = async () => {
    try {
        // Gọi phương thức từ Model để lấy tất cả các khóa học
        const allDepartment_leaders = await department_leaderModel.getAllDepartment_leaders()
        return allDepartment_leaders
    } catch (error) { throw error }
}

const getDetails = async (department_leaderId) => {
    try {
        const department_leader = await department_leaderModel.getDetails(department_leaderId)
        if (!department_leader) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Department_leader not found!')
        }

        return department_leader
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
        const updatedDepartment_leader = await department_leaderModel.update(id, updateData);
        return updatedDepartment_leader
    } catch (error) {
        throw error
    }
}

const deleteItem = async (department_leaderId) => {
    try {
        const targetDepartment_leader = await department_leaderModel.findOneById(department_leaderId)
        if (!targetDepartment_leader) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Department_leader not found!')
        }
        // Xóa department_leader
        await department_leaderModel.deleteOneById(department_leaderId)
        // Xóa toàn bộ student thuộc department_leader

        await studentModel.deleteManyByDepartment_leaderId(department_leaderId)

        // Xóa department_leaderId trong mảng department_leaderOrderIds trong Faculty chứa nó

        await departmentModel.pullDepartment_leaderOrderIds(targetDepartment_leader)

        return { deleteResult: 'The department_leader and its references have been deleted!'}
    } catch (error) {
        throw error
    }
}

export const department_leaderService = {
    createNew,
    getDetails,
    getAllDepartment_leaders,
    update,
    deleteItem
}