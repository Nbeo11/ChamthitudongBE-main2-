/* eslint-disable indent */
/* eslint-disable no-useless-catch */
// eslint-disable-next-line quotes
import { StatusCodes } from 'http-status-codes'
import { courseModel } from '~/models/courseModel'
import ApiError from '~/utils/ApiError'

const createNew = async (reqBody) => {
    try {
        //Xử lý logic dữ liệu tùy đặc thù dự án
        const newCourse = {
            ...reqBody,
        }

        //Gọi tới tầng Model để xử lý lưu bản ghi newCourse vào trong Database
        const createdCourse = await courseModel.createNew(newCourse)
        // console.log(createdCourse)

        //Lấy bản ghi course sau khi gọi (tùy mục đích dự án mà có cần bước này hay k)
        const getNewCourse = await courseModel.findOneById(createdCourse.insertedId)
        // console.log(getNewCourse)

        //Làm thêm các xử lý logic khác với các Collection khác tùy đặc thù dự án
        //Bắn email, notification về cho admon khi có 1 course mới đc tạo

        //Trả kết quả về, trong Service luôn phải có return
        return getNewCourse
    } catch (error) {
        throw error
    }
}

const getAllCourses = async () => {
    try {
        // Gọi phương thức từ Model để lấy tất cả các khóa học
        const allCourses = await courseModel.getAllCourses();
        // Trả về kết quả
        return allCourses;
    } catch (error) {
        // Xử lý lỗi nếu có
        throw error;
    }
}


const getDetails = async (courseId) => {
    try {
        const course = await courseModel.getDetails(courseId)
        if (!course) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Course not found!')
        }
        return course
    } catch (error) {
        throw error
    }
}

const update = async (id, reqBody) => {
    try {
        const updateData = {
            ...reqBody,
            updatedAt: Date.now()
        }
        const updatedCourse = await courseModel.update(id, updateData);
        return updatedCourse
    } catch (error) {
        throw error
    }
};

const deleteItem = async (courseId) => {
    try {
        // Xóa course
        await courseModel.deleteOneById(courseId);
        /*
        // Xóa toàn bộ ology và grade thuộc course
        const ologies = await ologyModel.getAllByCourseId(courseId);
        for (const ology of ologies) {
            // Lấy ologyId từ đối tượng ology, không sử dụng ology._id nếu không phải là ologyId
            const ologyId = ology._id;
            // Xóa toàn bộ grade thuộc ology
            await gradeModel.deleteManyByGradeId(ologyId);
        }

        // Sau khi xóa tất cả các grade, bạn có thể xóa tất cả các ology thuộc course
        await ologyModel.deleteManyByOlogyId(courseId);
        */
        return { deleteResult: 'The course and its references have been deleted!' };
    } catch (error) {
        throw error;
    }
};


export const courseService = {
    createNew,
    getDetails,
    getAllCourses,
    update,
    deleteItem
}