/* eslint-disable indent */
import { StatusCodes } from 'http-status-codes'
import { ologyService } from '~/services/ologyService'

const createNew = async (req, res, next) => {
    try {
        const createdOlogy = await ologyService.createNew(req.body)
        res.status(StatusCodes.CREATED).json(createdOlogy)
    } catch (error) { next(error) }
}


const getAllOlogies = async (req, res, next) => {
    try {
        const allOlogies = await ologyService.getAllOlogies();
        res.status(StatusCodes.OK).json(allOlogies);
    } catch (error) {
        next(error);
    }
}

const getDetails = async (req, res, next) => {
    try {
        const ologyId = req.params.id
        const ology = await ologyService.getDetails(ologyId)
        res.status(StatusCodes.OK).json(ology)
    } catch (error) { next(error) }
}

const update = async (req, res, next) => {
    try {
        const ologyId = req.params.id;
        const updatedOlogy = await ologyService.update(ologyId, req.body);

        res.status(StatusCodes.OK).json(updatedOlogy);
    } catch (error) {
        next(error);
    }
}

const deleteItem = async (req, res, next) => {
    try {
        const ologyId = req.params.id
        const result = await ologyService.deleteItem(ologyId)

        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
}


export const ologyController = {
    createNew,
    getDetails,
    update,
    deleteItem,
    getAllOlogies
}