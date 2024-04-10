/* eslint-disable indent */
import { StatusCodes } from 'http-status-codes'
import { department_leaderService } from '~/services/department_leaderService'

const createNew = async (req, res, next) => {
    try {
        const createdDepartment_leader = await department_leaderService.createNew(req.body)
        res.status(StatusCodes.CREATED).json(createdDepartment_leader)
    } catch (error) { next(error) }
}


const getAllDepartment_leaders = async (req, res, next) => {
    try {
        const allDepartment_leaders = await department_leaderService.getAllDepartment_leaders();
        res.status(StatusCodes.OK).json(allDepartment_leaders);
    } catch (error) {
        next(error);
    }
}

const getDetails = async (req, res, next) => {
    try {
        const department_leaderId = req.params.id
        const department_leader = await department_leaderService.getDetails(department_leaderId)
        res.status(StatusCodes.OK).json(department_leader)
    } catch (error) { next(error) }
}

const update = async (req, res, next) => {
    try {
        const department_leaderId = req.params.id;
        const updatedDepartment_leader = await department_leaderService.update(department_leaderId, req.body);

        res.status(StatusCodes.OK).json(updatedDepartment_leader);
    } catch (error) {
        next(error);
    }
}

const deleteItem = async (req, res, next) => {
    try {
        const department_leaderId = req.params.id
        const result = await department_leaderService.deleteItem(department_leaderId)

        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
}

export const department_leaderController = {
    createNew,
    getDetails,
    getAllDepartment_leaders,
    update,
    deleteItem
}