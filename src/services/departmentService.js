/* eslint-disable indent */
/* eslint-disable no-useless-catch */
// eslint-disable-next-line quotes
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { departmentModel } from '~/models/departmentModel'
import { facultyModel } from '~/models/facultyModel'
import { teacherModel } from '~/models/teacherModel'
import ApiError from '~/utils/ApiError'

const createNew = async (reqBody) => {
    try {
        const newDepartment = {
            ...reqBody
        }
        const createdDepartment = await departmentModel.createNew(newDepartment)
        const getNewDepartment = await departmentModel.findOneById(createdDepartment.insertedId)

        if (getNewDepartment) {
            // Xử lý cấu trúc data ở đây trước khi trả dữ liệu về
            getNewDepartment.teachers = []

            //Cập nhật mảng departmentOrderIds trong collection facultys
            await facultyModel.pushDepartmentOrderIds(getNewDepartment)
        }

        return getNewDepartment
    } catch (error) {
        throw error
    }
}

const getAllByFacultyId = async (facultyId) => {
    try {
        // Gọi phương thức từ Model để lấy tất cả các ngành học
        const allDepartments = await departmentModel.getAllByFacultyId(facultyId)
        return allDepartments
    } catch (error) { throw error }
}

const getDetails = async (departmentId) => {
    try {
        const department = await departmentModel.getDetails(departmentId);
        if (!department) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Department not found!')
        }
        const resDepartment = cloneDeep(department)
        resDepartment.teachers.forEach(teacher => {
            teacher.students = resDepartment.students.filter(student => student.teacherId.equals(teacher._id))
        })

        delete resDepartment.students


        return resDepartment
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
        const updatedDepartment = await departmentModel.update(id, updateData);
        return updatedDepartment
    } catch (error) {
        throw error
    }
}


const deleteItem = async (departmentId) => {
    try {
        const targetDepartment = await departmentModel.findOneById(departmentId)
        if (!targetDepartment) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Department not found!')
        }
        // Xóa department
        await departmentModel.deleteOneById(departmentId)
        // Xóa toàn bộ teacher thuộc department

        await teacherModel.deleteManyByTeacherId(departmentId)

        // Xóa departmentId trong mảng departmentOrderIds trong Faculty chứa nó

        await facultyModel.pullDepartmentOrderIds(targetDepartment)

        return { deleteResult: 'The department and its references have been deleted!' }
    } catch (error) {
        throw error
    }
}

export const departmentService = {
    createNew,
    getDetails,
    getAllByFacultyId,
    update,
    deleteItem
}