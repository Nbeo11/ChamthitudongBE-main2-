/* eslint-disable indent */
import { StatusCodes } from 'http-status-codes';
import { studentService } from '~/services/studentService';
import { studentModel } from '../models/studentModel';
import { parseExcelFile } from '../utils/excelParser';

const createNew = async (req, res, next) => {
    try {
        const createdStudent = await studentService.createNew(req.body)
        res.status(StatusCodes.CREATED).json(createdStudent)
    } catch (error) { next(error) }
}

const getAllStudents = async (req, res, next) => {
    try {
        const allStudents = await studentService.getAllStudents();
        res.status(StatusCodes.OK).json(allStudents);
    } catch (error) {
        next(error);
    }
}


const getAllByGradeId = async (req, res, next) => {
    try {
        const gradeId = req.params.gradeId
        const allStudents = await studentService.getAllByGradeId(gradeId);
        res.status(StatusCodes.OK).json(allStudents);
    } catch (error) {
        next(error);
    }
}

const getDetails = async (req, res, next) => {
    try {
        const studentId = req.params.id
        const student = await studentService.getDetails(studentId)
        res.status(StatusCodes.OK).json(student)
    } catch (error) { next(error) }
}

const update = async (req, res, next) => {
    try {
        const studentId = req.params.id;
        const updatedStudent = await studentService.update(studentId, req.body);

        res.status(StatusCodes.OK).json(updatedStudent);
    } catch (error) {
        next(error);
    }
}

const deleteItem = async (req, res, next) => {
    try {
        const studentId = req.params.id
        const result = await studentService.deleteItem(studentId)

        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
}

const addStudentsFromExcel = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Xử lý file Excel để lấy dữ liệu sinh viên
        const studentsData = await parseExcelFile(req.file.path);

        // Thêm sinh viên từ dữ liệu đã được trích xuất
        const addedStudents = await studentModel.createNew(studentsData);

        // Trả về kết quả cho client
        return res.status(200).json({ message: 'Students added successfully', data: addedStudents });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const studentController = {
    createNew,
    getDetails,
    getAllByGradeId,
    update,
    deleteItem,
    addStudentsFromExcel,
    getAllStudents
}