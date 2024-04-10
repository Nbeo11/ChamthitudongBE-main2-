/* eslint-disable indent */
import { StatusCodes } from 'http-status-codes'
import { tranning_departmentService } from '~/services/tranning_departmentService'

const createNew = async (req, res, next) => {
    try {
        const createdTranning_department = await tranning_departmentService.createNew(req.body)
        res.status(StatusCodes.CREATED).json(createdTranning_department)
    } catch (error) { next(error) }
}


const getAllTranning_departments = async (req, res, next) => {
    try {
        const allTranning_departments = await tranning_departmentService.getAllTranning_departments();
        res.status(StatusCodes.OK).json(allTranning_departments);
    } catch (error) {
        next(error);
    }
}

const getDetails = async (req, res, next) => {
    try {
        const tranning_departmentId = req.params.id
        const tranning_department = await tranning_departmentService.getDetails(tranning_departmentId)
        res.status(StatusCodes.OK).json(tranning_department)
    } catch (error) { next(error) }
}

export const tranning_departmentController = {
    createNew,
    getDetails,
    getAllTranning_departments
}