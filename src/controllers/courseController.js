/* eslint-disable indent */
import { StatusCodes } from 'http-status-codes'
import { courseService } from '~/services/courseService'

const createNew = async (req, res, next) => {
    try {
        // console.log(req.body)

        //Điều hướng dữ liệu sang tầng Service
        const createdCourse = await courseService.createNew(req.body)

        //Có kết quả thì trả về phía Client
        res.status(StatusCodes.CREATED).json(createdCourse)
    } catch (error) { next(error) }
}

const getAllCourses = async (req, res, next) => {
    try {
        // Gọi phương thức từ service để lấy tất cả các khóa học
        const allCourses = await courseService.getAllCourses();

        // Trả về kết quả
        res.status(StatusCodes.OK).json(allCourses);
    } catch (error) {
        // Xử lý lỗi nếu có
        next(error);
    }
}


const getDetails = async (req, res, next) => {
    try {
        // console.log(req.params)
        const courseId = req.params.id

        const course = await courseService.getDetails(courseId)

        res.status(StatusCodes.OK).json(course)
    } catch (error) { next(error) }
}


const update = async (req, res, next) => {
    try {
        const courseId = req.params.id;
        const updatedCourse = await courseService.update(courseId, req.body);

        res.status(StatusCodes.OK).json(updatedCourse);
    } catch (error) {
        next(error);
    }
}

const deleteItem = async (req, res, next) => {
    try {
        const courseId = req.params.id
        const result = await courseService.deleteItem(courseId);

        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
}

export const courseController = {
    createNew,
    getDetails,
    getAllCourses,
    update,
    deleteItem
}