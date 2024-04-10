/* eslint-disable indent */
import { StatusCodes } from 'http-status-codes'
import { difficultService } from '~/services/Exam/difficultService'

const createNew = async (req, res, next) => {
    try {
        const createdDifficult = await difficultService.createNew(req.body)
        res.status(StatusCodes.CREATED).json(createdDifficult)
    } catch (error) { next(error) }
}


const getAllDifficults = async (req, res, next) => {
    try {
        const allDifficults = await difficultService.getAllDifficults();
        res.status(StatusCodes.OK).json(allDifficults);
    } catch (error) {
        next(error);
    }
}

const getDetails = async (req, res, next) => {
    try {
        const difficultId = req.params.id
        const difficult = await difficultService.getDetails(difficultId)
        res.status(StatusCodes.OK).json(difficult)
    } catch (error) { next(error) }
}

const update = async (req, res, next) => {
    try {
        const difficultId = req.params.id;
        const updatedDifficult = await difficultService.update(difficultId, req.body);

        res.status(StatusCodes.OK).json(updatedDifficult);
    } catch (error) {
        next(error);
    }
}

const deleteItem = async (req, res, next) => {
    try {
        const difficultId = req.params.id
        const result = await difficultService.deleteItem(difficultId)

        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
}

export const difficultController = {
    createNew,
    getDetails,
    getAllDifficults,
    update,
    deleteItem
}