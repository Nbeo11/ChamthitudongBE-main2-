/* eslint-disable indent */
import { StatusCodes } from 'http-status-codes'
import { moduleService } from '~/services/Module/moduleService'

const createNew = async (req, res, next) => {
    try {
        const createdModule = await moduleService.createNew(req.body)
        res.status(StatusCodes.CREATED).json(createdModule)
    } catch (error) { next(error) }
}

const getAllModules = async (req, res, next) => {
    try {
        const allModules = await moduleService.getAllModules();
        res.status(StatusCodes.OK).json(allModules);
    } catch (error) {
        next(error);
    }
}

const getDetails = async (req, res, next) => {
    try {
        const moduleId = req.params.id
        const module = await moduleService.getDetails(moduleId)
        res.status(StatusCodes.OK).json(module)
    } catch (error) { next(error) }
}

const update = async (req, res, next) => {
    try {
        const moduleId = req.params.id;
        const updatedModule = await moduleService.update(moduleId, req.body);

        res.status(StatusCodes.OK).json(updatedModule);
    } catch (error) {
        next(error);
    }
}

const updateModuleAndChapters = async (req, res, next) => {
    try {
        const moduleId = req.params.id;
        const updatedModule = await moduleService.updateModuleAndChapters(moduleId, req.body);

        res.status(StatusCodes.OK).json(updatedModule);
    } catch (error) {
        next(error);
    }
}

const deleteItem = async (req, res, next) => {
    try {
        const moduleId = req.params.id
        const result = await moduleService.deleteItem(moduleId)

        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
}

export const moduleController = {
    createNew,
    getDetails,
    getAllModules,
    updateModuleAndChapters,
    deleteItem,
    update
}
