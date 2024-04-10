/* eslint-disable indent */
import { StatusCodes } from 'http-status-codes'
import { student_examService } from '~/services/Exam/student_examService'

const createNew = async (req, res, next) => {
    try {
        const createdStudent_exam = await student_examService.createNew(req.body)
        res.status(StatusCodes.CREATED).json(createdStudent_exam)
    } catch (error) { next(error) }
}


const getAllStudent_exams = async (req, res, next) => {
    try {
        const allStudent_exams = await student_examService.getAllStudent_exams();
        res.status(StatusCodes.OK).json(allStudent_exams);
    } catch (error) {
        next(error);
    }
}

const getDetails = async (req, res, next) => {
    try {
        const student_examId = req.params.id
        const student_exam = await student_examService.getDetails(student_examId)
        res.status(StatusCodes.OK).json(student_exam)
    } catch (error) { next(error) }
}

const update = async (req, res, next) => {
    try {
        const student_examId = req.params.id;
        const updatedStudent_exam = await student_examService.update(student_examId, req.body);

        res.status(StatusCodes.OK).json(updatedStudent_exam);
    } catch (error) {
        next(error);
    }
}

const deleteItem = async (req, res, next) => {
    try {
        const student_examId = req.params.id
        const result = await student_examService.deleteItem(student_examId)

        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
}

export const student_examController = {
    createNew,
    getDetails,
    getAllStudent_exams,
    update,
    deleteItem
}