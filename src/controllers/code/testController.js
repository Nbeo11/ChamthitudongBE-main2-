/* eslint-disable indent */
import { StatusCodes } from 'http-status-codes'
import { testService } from '~/services/code/testService'

const createNew = async (req, res, next) => {
    try {
        const createdTest = await testService.createNew(req.body)
        res.status(StatusCodes.CREATED).json(createdTest)
    } catch (error) { next(error) }
}


const getAllTests = async (req, res, next) => {
    try {
        const allTests = await testService.getAllTests();
        res.status(StatusCodes.OK).json(allTests);
    } catch (error) {
        next(error);
    }
}

const getDetails = async (req, res, next) => {
    try {
        const testId = req.params.id
        const test = await testService.getDetails(testId)
        res.status(StatusCodes.OK).json(test)
    } catch (error) { next(error) }
}

const update = async (req, res, next) => {
    try {
        const testId = req.params.id;
        const updatedTest = await testService.update(testId, req.body);

        res.status(StatusCodes.OK).json(updatedTest);
    } catch (error) {
        next(error);
    }
}

const deleteItem = async (req, res, next) => {
    try {
        const testId = req.params.id
        const result = await testService.deleteItem(testId)

        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
}

export const testController = {
    createNew,
    getDetails,
    getAllTests,
    update,
    deleteItem
}