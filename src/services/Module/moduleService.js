/* eslint-disable indent */
/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import { exam_structureModel } from '~/models/Exam/exam_structureModel'
import { moduleModel } from '~/models/Module/moduleModel'
import { teaching_groupModel } from '~/models/Module/teaching_groupModel'
import ApiError from '~/utils/ApiError'

const createNew = async (reqBody) => {
    try {
        const newModule = {
            ...reqBody
        }
        const createdModule = await moduleModel.createNew(newModule)
        const moduleId = createdModule.insertedId
        const newExamStructure = {
            moduleId: moduleId.toString(), // Sử dụng moduleId của module vừa tạo
            // Thêm các trường dữ liệu khác của exam_structure tại đây nếu cần
        }
        await exam_structureModel.createNew(newExamStructure)
        const getNewModule = await moduleModel.findOneById(createdModule.insertedId)
        
        return getNewModule
    } catch (error) {
        throw error
    }
}

const getAllModules = async () => {
    try {
        const allModules = await moduleModel.getAllModules()
        return allModules
    } catch (error) { throw error }
}

const getDetails = async (moduleId) => {
    try {
        const module = await moduleModel.getDetails(moduleId)
        if (!module) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Module not found!')
        }

        return module
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
        const updatedModule = await moduleModel.update(id, updateData);
        return updatedModule
    } catch (error) {
        throw error
    }
}

const updateModuleAndChapters = async (moduleId, updateData) => {
    try {
        const updatedModule = await moduleModel.updateModuleAndChapters(moduleId, updateData);
        return updatedModule
    } catch (error) {
        throw error
    }
}

const deleteItem = async (moduleId) => {
    try {
        const targetModule = await moduleModel.findOneById(moduleId)
        if (!targetModule) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Module not found!')
        }
        // Xóa module
        await moduleModel.deleteOneById(moduleId)
        await teaching_groupModel.deleteByModuleId(moduleId)
        await exam_structureModel.deleteByModuleId(moduleId)
        return { deleteResult: 'The module and its references have been deleted!'}
    } catch (error) {
        throw error
    }
}

export const moduleService = {
    createNew,
    getDetails,
    getAllModules,
    updateModuleAndChapters,
    deleteItem,
    update
}
