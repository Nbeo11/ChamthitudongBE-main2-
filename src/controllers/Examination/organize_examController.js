/* eslint-disable indent */
import { StatusCodes } from 'http-status-codes'
import { organize_examService } from '~/services/Examination/organize_examService'

const createNew = async (req, res, next) => {
    try {
        const createdOrganize_exam = await organize_examService.createNew(req.body)
        res.status(StatusCodes.CREATED).json(createdOrganize_exam)
    } catch (error) { next(error) }
}


const getAllOrganize_exams = async (req, res, next) => {
    try {
        const allOrganize_exams = await organize_examService.getAllOrganize_exams();
        res.status(StatusCodes.OK).json(allOrganize_exams);
    } catch (error) {
        next(error);
    }
}

const getDetails = async (req, res, next) => {
    try {
        const organize_examId = req.params.id
        const organize_exam = await organize_examService.getDetails(organize_examId)
        res.status(StatusCodes.OK).json(organize_exam)
    } catch (error) { next(error) }
}

const update = async (req, res, next) => {
    try {
        const organize_examId = req.params.id;
        const updatedOrganize_exam = await organize_examService.update(organize_examId, req.body);

        res.status(StatusCodes.OK).json(updatedOrganize_exam);
    } catch (error) {
        next(error);
    }
}

const deleteItem = async (req, res, next) => {
    try {
        const organize_examId = req.params.id
        const result = await organize_examService.deleteItem(organize_examId)

        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
}

const getDetailByGradeId = async (req, res, next) => {
    try {
        const gradeId = req.params.gradeId;
        const detail = await organize_examService.getDetailByGradeId(gradeId);
        res.status(StatusCodes.OK).json(detail);
    } catch (error) {
        next(error);
    }
};

export const organize_examController = {
    createNew,
    getDetails,
    getAllOrganize_exams,
    update,
    deleteItem,
    getDetailByGradeId 
}