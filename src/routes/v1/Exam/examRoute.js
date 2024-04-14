/* eslint-disable indent */
import express from 'express';
import { examController } from '~/controllers/Exam/examController';
import { examModel } from '~/models/Exam/examModel';
import { examValidation } from '~/validations/Exam/examValidation';

const Router = express.Router();

Router.route('/')
    .get(examController.getAllExams)
    .post(examValidation.createNew, examController.createNew);

Router.route('/createauto/:moduleId')
.post(async (req, res, next) => {
    try {
        const { moduleId } = req.params;
        const numberOfExams = req.body.number || 1; // Số đề mặc định là 1 nếu không có tham số number được đưa vào

        const createdAutoExams = await examModel.createAutoExam(moduleId, numberOfExams);
        res.status(201).json(createdAutoExams);
    } catch (error) {
        next(error);
    }
});
Router.route('/:id')
    .get(examController.getDetails)
    .put(examValidation.update, examController.update)
    .delete(examValidation.deleteItem, examController.deleteItem);

export const examRoute = Router;
