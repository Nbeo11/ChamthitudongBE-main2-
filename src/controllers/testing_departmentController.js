/* eslint-disable indent */
import { StatusCodes } from 'http-status-codes'
import { testing_departmentService } from '~/services/testing_departmentService'

const createNew = async (req, res, next) => {
    try {
        const createdTesting_department = await testing_departmentService.createNew(req.body)
        res.status(StatusCodes.CREATED).json(createdTesting_department)
    } catch (error) { next(error) }
}


const getAllTesting_departments = async (req, res, next) => {
    try {
        const allTesting_departments = await testing_departmentService.getAllTesting_departments();
        res.status(StatusCodes.OK).json(allTesting_departments);
    } catch (error) {
        next(error);
    }
}

const getDetails = async (req, res, next) => {
    try {
        const testing_departmentId = req.params.id
        const testing_department = await testing_departmentService.getDetails(testing_departmentId)
        res.status(StatusCodes.OK).json(testing_department)
    } catch (error) { next(error) }
}

export const testing_departmentController = {
    createNew,
    getDetails,
    getAllTesting_departments
}