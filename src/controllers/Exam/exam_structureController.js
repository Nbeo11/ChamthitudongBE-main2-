/* eslint-disable indent */
import { StatusCodes } from 'http-status-codes'
import { exam_structureService } from '~/services/Exam/exam_structureService'

const createNew = async (req, res, next) => {
    try {
        const createdExam_structure = await exam_structureService.createNew(req.body)
        res.status(StatusCodes.CREATED).json(createdExam_structure)
    } catch (error) { next(error) }
}


const getAllExam_structures = async (req, res, next) => {
    try {
        const allExam_structures = await exam_structureService.getAllExam_structures();
        res.status(StatusCodes.OK).json(allExam_structures);
    } catch (error) {
        next(error);
    }
}

const getDetails = async (req, res, next) => {
    try {
        const exam_structureId = req.params.id
        const exam_structure = await exam_structureService.getDetails(exam_structureId)
        res.status(StatusCodes.OK).json(exam_structure)
    } catch (error) { next(error) }
}

const update = async (req, res, next) => {
    try {
        const exam_structureId = req.params.id;
        const updatedExam_structure = await exam_structureService.update(exam_structureId, req.body);

        res.status(StatusCodes.OK).json(updatedExam_structure);
    } catch (error) {
        next(error);
    }
}

const deleteItem = async (req, res, next) => {
    try {
        const exam_structureId = req.params.id
        const result = await exam_structureService.deleteItem(exam_structureId)

        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
}

export const exam_structureController = {
    createNew,
    getDetails,
    getAllExam_structures,
    update,
    deleteItem
}