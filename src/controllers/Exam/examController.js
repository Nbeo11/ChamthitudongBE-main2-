/* eslint-disable indent */
import { StatusCodes } from 'http-status-codes'
import { examService } from '~/services/Exam/examService'

const createNew = async (req, res, next) => {
    try {
        const createdExam = await examService.createNew(req.body)
        res.status(StatusCodes.CREATED).json(createdExam)
    } catch (error) { next(error) }
}


const getAllExams = async (req, res, next) => {
    try {
        const allExams = await examService.getAllExams();
        res.status(StatusCodes.OK).json(allExams);
    } catch (error) {
        next(error);
    }
}

const getByModuleId = async (req, res, next) => {
    try {
        const moduleId = req.params.moduleId
        const allExams = await examService.getByModuleId(moduleId);
        res.status(StatusCodes.OK).json(allExams);
    } catch (error) {
        next(error);
    }
}

const getDetails = async (req, res, next) => {
    try {
        const examId = req.params.id
        const exam = await examService.getDetails(examId)
        res.status(StatusCodes.OK).json(exam)
    } catch (error) { next(error) }
}

const update = async (req, res, next) => {
    try {
        const examId = req.params.id;
        const updatedExam = await examService.update(examId, req.body);

        res.status(StatusCodes.OK).json(updatedExam);
    } catch (error) {
        next(error);
    }
}

const deleteItem = async (req, res, next) => {
    try {
        const examId = req.params.id
        const result = await examService.deleteItem(examId)

        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
}

export const examController = {
    createNew,
    getDetails,
    getAllExams,
    update,
    deleteItem,
    getByModuleId
}