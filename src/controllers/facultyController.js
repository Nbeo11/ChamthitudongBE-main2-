/* eslint-disable indent */
import { StatusCodes } from 'http-status-codes'
import { facultyService } from '~/services/facultyService'

const createNew = async (req, res, next) => {
    try {
        // console.log(req.body)

        //Điều hướng dữ liệu sang tầng Service
        const createdFaculty = await facultyService.createNew(req.body)

        //Có kết quả thì trả về phía Client
        res.status(StatusCodes.CREATED).json(createdFaculty)
    } catch (error) { next(error) }
}

const getAllFaculties = async (req, res, next) => {
    try {
        // Gọi phương thức từ service để lấy tất cả các khóa học
        const allFaculties = await facultyService.getAllFaculties();

        // Trả về kết quả
        res.status(StatusCodes.OK).json(allFaculties);
    } catch (error) {
        // Xử lý lỗi nếu có
        next(error);
    }
}


const getDetails = async (req, res, next) => {
    try {
        // console.log(req.params)
        const facultyId = req.params.id

        const faculty = await facultyService.getDetails(facultyId)

        res.status(StatusCodes.OK).json(faculty)
    } catch (error) { next(error) }
}


const update = async (req, res, next) => {
    try {
        const facultyId = req.params.id;
        const updatedFaculty = await facultyService.update(facultyId, req.body);

        res.status(StatusCodes.OK).json(updatedFaculty);
    } catch (error) {
        next(error);
    }
}

const deleteItem = async (req, res, next) => {
    try {
        const facultyId = req.params.id
        const result = await facultyService.deleteItem(facultyId);

        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
}

export const facultyController = {
    createNew,
    getDetails,
    getAllFaculties,
    update,
    deleteItem
}