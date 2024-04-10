/* eslint-disable indent */
import express from 'express';
import { studentcodeController } from '~/controllers/code/studentcodeController';
import { studentcodeValidation } from '~/validations/code/studentcodeValidation';

const Router = express.Router();

Router.route('/')
    .post(studentcodeValidation.createNewStudentCode, studentcodeController.createNewStudentCode);

Router.route('/:student_examId/:question_bankId/studentcodes') // Thêm '/:student_examId' để truyền student_examId vào đây
    .get(studentcodeController.findOneByQuestionAndExamId); // Sử dụng hàm findOneByQuestionAndExamId trong controller

Router.route('/:student_examId/studentcodes') // Thêm '/:courseId/ologies' để truyền courseId vào đây
    .get(studentcodeController.getAllByStudentExamId);

Router.route('/:id')
    .get(studentcodeController.getStudentCodeDetails)
    .put(studentcodeValidation.updateStudentCode, studentcodeController.updateStudentCode)
    .delete(studentcodeValidation.deleteStudentCode, studentcodeController.deleteStudentCode);

export const studentcodeRoute = Router;
