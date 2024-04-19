/* eslint-disable indent */
import { StatusCodes } from 'http-status-codes'
import { gradeService } from '~/services/gradeService'

const createNew = async (req, res, next) => {
    try {
        const createdGrade = await gradeService.createNew(req.body)
        res.status(StatusCodes.CREATED).json(createdGrade)
    } catch (error) { next(error) }
}


const getAllByOlogyId = async (req, res, next) => {
    try {
        const ologyId = req.params.ologyId; // Lấy ologyId từ request params
        const allGrades = await gradeService.getAllByOlogyId(ologyId); // Truyền courseId vào hàm
        res.status(StatusCodes.OK).json(allGrades);
    } catch (error) {
        next(error);
    }
}

const getAllByCourseAndOlogyId = async (req, res, next) => {
    try {
        const courseId = req.params.courseId;
        const ologyId = req.params.ologyId;
        const result = await gradeService.getAllByCourseAndOlogyId(courseId, ologyId);
        res.status(StatusCodes.OK).json(result);
        
    } catch (error) {
        next(error);
    }
}


const getAllGrade = async (req, res, next) => {
    try {
        const allGrades = await gradeService.getAllGrade(); // Truyền courseId vào hàm
        res.status(StatusCodes.OK).json(allGrades);
    } catch (error) {
        next(error);
    }
}


const getDetails = async (req, res, next) => {
    try {
        const gradeId = req.params.id
        const grade = await gradeService.getDetails(gradeId)
        res.status(StatusCodes.OK).json(grade)
    } catch (error) { next(error) }
}

const update = async (req, res, next) => {
    try {
        const gradeId = req.params.id;
        const updatedGrade = await gradeService.update(gradeId, req.body);

        res.status(StatusCodes.OK).json(updatedGrade);
    } catch (error) {
        next(error);
    }
}

const deleteItem = async (req, res, next) => {
    try {
        const gradeId = req.params.id
        const result = await gradeService.deleteItem(gradeId)

        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
}

export const gradeController = {
    createNew,
    getDetails,
    getAllByOlogyId,
    getAllGrade,
    update,
    deleteItem,
    getAllByCourseAndOlogyId
}