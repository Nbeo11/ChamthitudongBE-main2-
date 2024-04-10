/* eslint-disable indent */
import { StatusCodes } from 'http-status-codes';
import { studentcodeService } from '~/services/code/studentcodeService';

const createNewStudentCode = async (req, res, next) => {
    try {
        const createdStudentCode = await studentcodeService.createNewStudentCode(req.body);
        res.status(StatusCodes.CREATED).json(createdStudentCode);
    } catch (error) {
        next(error);
    }
};

const getStudentCodeDetails = async (req, res, next) => {
    try {
        const studentCodeId = req.params.id;
        const studentCode = await studentcodeService.getStudentCodeDetails(studentCodeId);
        res.status(StatusCodes.OK).json(studentCode);
    } catch (error) {
        next(error);
    }
};

const getAllByStudentExamId = async (req, res, next) => {
    try {
        const student_examId = req.params.student_examId; // Lấy student_examId từ request params
        const allStudentCodes = await studentcodeService.getAllByStudentExamId(student_examId); // Truyền student_examId vào hàm
        res.status(StatusCodes.OK).json(allStudentCodes);
    } catch (error) {
        next(error);
    }
}

const updateStudentCode = async (req, res, next) => {
    try {
        const studentCodeId = req.params.id;
        const updatedStudentCode = await studentcodeService.updateStudentCode(studentCodeId, req.body);
        res.status(StatusCodes.OK).json(updatedStudentCode);
    } catch (error) {
        next(error);
    }
};

const deleteStudentCode = async (req, res, next) => {
    try {
        const studentCodeId = req.params.id;
        const result = await studentcodeService.deleteStudentCode(studentCodeId);
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
};

const findOneByQuestionAndExamId = async (req, res, next) => {
    try {
        const question_bankId = req.params.question_bankId; // Lấy question_bankId từ request params
        const student_examId = req.params.student_examId; // Lấy student_examId từ request params
        const result = await studentcodeService.findOneByQuestionAndExamId(student_examId, question_bankId);
        res.status(StatusCodes.OK).json(result);
        
    } catch (error) {
        next(error);
    }
}


export const studentcodeController = {
    createNewStudentCode,
    getStudentCodeDetails,
    getAllByStudentExamId,
    updateStudentCode,
    deleteStudentCode,
    findOneByQuestionAndExamId
};
