/* eslint-disable indent */
import { StatusCodes } from 'http-status-codes'
import { departmentService } from '~/services/departmentService'

const createNew = async (req, res, next) => {
    try {
        const createdDepartment = await departmentService.createNew(req.body)
        res.status(StatusCodes.CREATED).json(createdDepartment)
    } catch (error) { next(error) }
}


const getAllByFacultyId = async (req, res, next) => {
    try {
        const facultyId = req.params.facultyId;
        const allDepartments = await departmentService.getAllByFacultyId(facultyId);
        res.status(StatusCodes.OK).json(allDepartments);
    } catch (error) {
        next(error);
    }
}

const getDetails = async (req, res, next) => {
    try {
        const departmentId = req.params.id
        const department = await departmentService.getDetails(departmentId)
        res.status(StatusCodes.OK).json(department)
    } catch (error) { next(error) }
}

const update = async (req, res, next) => {
    try {
        const departmentId = req.params.id;
        const updatedDepartment = await departmentService.update(departmentId, req.body);

        res.status(StatusCodes.OK).json(updatedDepartment);
    } catch (error) {
        next(error);
    }
}

const deleteItem = async (req, res, next) => {
    try {
        const departmentId = req.params.id
        const result = await departmentService.deleteItem(departmentId)

        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
}


export const departmentController = {
    createNew,
    getDetails,
    getAllByFacultyId,
    update,
    deleteItem
}