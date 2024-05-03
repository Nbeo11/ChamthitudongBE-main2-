/* eslint-disable indent */
import express from 'express'
import { student_examController } from '~/controllers/Exam/student_examController'
import { student_examModel } from '~/models/Exam/student_examModel'
import { student_examValidation } from '~/validations/Exam/student_examValidation'

const Router = express.Router()

Router.route('/')
    .get(student_examController.getAllStudent_exams)
    .post(student_examValidation.createNew, student_examController.createNew)
Router.route('/random/:moduleId')
    .post(async (req, res, next) => {
        try {
            const { moduleId } = req.params;

            const createdAutoExams = await student_examModel.assignRandomExamToStudent(moduleId);
            res.status(201).json(createdAutoExams);
        } catch (error) {
            next(error);
        }
    });

Router.route('/:moduleId/:studentId/studentexam') // Thêm '/:student_examId' để truyền student_examId vào đây
    .get(student_examController.findOneByModuleandStudentId); // Sử dụng hàm findOneByQuestionAndExamId trong controller

Router.route('/:id')
    .get(student_examController.getDetails)
    .put(student_examValidation.update, student_examController.update)
    .delete(student_examValidation.deleteItem, student_examController.deleteItem)
export const student_examRoute = Router