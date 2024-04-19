/* eslint-disable indent */
import express from 'express';
import multer from 'multer'; // Thư viện multer để xử lý tải file
import { studentController } from '~/controllers/studentController';
import { studentValidation } from '~/validations/studentValidation';

const Router = express.Router()
const upload = multer({ dest: 'uploads/' });

Router.route('/')
    .get(studentController.getAllStudents)
    .post(studentValidation.createNew, studentController.createNew)

Router.route('/:gradeId/students')
    .get(studentController.getAllByGradeId);

Router.route('/:id')
    .get(studentController.getDetails)
    .put(studentValidation.update, studentController.update)
    .delete(studentValidation.deleteItem, studentController.deleteItem)

Router.post('/students/upload', upload.single('excelFile'), studentController.addStudentsFromExcel)

export const studentRoute = Router