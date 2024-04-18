/* eslint-disable indent */
/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import { moduleModel } from '~/models/Module/moduleModel'
import ApiError from '~/utils/ApiError'

const createNew = async (reqBody) => {
    try {
        const newModule = {
            ...reqBody
        }
        const createdModule = await moduleModel.createNew(newModule)
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
        // Xóa toàn bộ student thuộc module

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
