/* eslint-disable indent */
import { StatusCodes } from 'http-status-codes'
import { contestService } from '~/services/Examination/contestService'

const createNew = async (req, res, next) => {
    try {
        const createdContest = await contestService.createNew(req.body)
        res.status(StatusCodes.CREATED).json(createdContest)
    } catch (error) { next(error) }
}


const getAllContests = async (req, res, next) => {
    try {
        const allContests = await contestService.getAllContests();
        res.status(StatusCodes.OK).json(allContests);
    } catch (error) {
        next(error);
    }
}

const getDetails = async (req, res, next) => {
    try {
        const contestId = req.params.id
        const contest = await contestService.getDetails(contestId)
        res.status(StatusCodes.OK).json(contest)
    } catch (error) { next(error) }
}

const update = async (req, res, next) => {
    try {
        const contestId = req.params.id;
        const updatedContest = await contestService.update(contestId, req.body);

        res.status(StatusCodes.OK).json(updatedContest);
    } catch (error) {
        next(error);
    }
}

const deleteItem = async (req, res, next) => {
    try {
        const contestId = req.params.id
        const result = await contestService.deleteItem(contestId)

        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
}

export const contestController = {
    createNew,
    getDetails,
    getAllContests,
    update,
    deleteItem
}