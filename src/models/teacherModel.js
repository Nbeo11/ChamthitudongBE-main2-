/* eslint-disable no-useless-catch */
/* eslint-disable indent */
// Giảng viên (user)
import bcrypt from 'bcrypt'
import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
// Trong file teacherModel.js
import { userModel } from './userModel'

//Define Collection (Name & Schema)
const TEACHER_COLLECTION_NAME = 'teachers'
const TEACHER_COLLECTION_SCHEMA = Joi.object({
    facultyId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    departmentId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    username: Joi.string().required().min(1).max(50).trim().strict(),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(1).max(50).trim().strict(),
    birth: Joi.date().iso(),
    gender: Joi.string().valid('male', 'female', 'other'),
    phoneNumber: Joi.string().pattern(/^[0-9]{10,11}$/),
    role: Joi.string().default('giangvien'), // Đặt giá trị mặc định là "giangvien"
    note: Joi.string().min(1).max(50).trim().strict(),
    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null),
    _destroy: Joi.boolean().default(false)
})

const INVALID_UPDATE_FIELDS = ['_id', 'email']

const validateBeforeCreate = async (data) => {
    return await TEACHER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const hashPassword = async (password) => {
    const saltRounds = 10; // Số vòng lặp sử dụng cho thuật toán băm
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

const createNew = async (data) => {
    try {
        // Kiểm tra xem email đã tồn tại trong cơ sở dữ liệu chưa
        const existingUser = await GET_DB().collection(userModel.USER_COLLECTION_NAME).findOne({ email: data.email });
        if (existingUser) {
            throw new Error('Email already exists');
        }

        // Nếu email chưa tồn tại, tiếp tục quá trình tạo người dùng mới
        const validData = await validateBeforeCreate(data)

        const hashedPassword = await hashPassword(data.password);

        // Biến đổi một số dữ liệu liên quan tới OjectId chuẩn chỉnh
        const newTeacherToAdd = {
            ...validData,
            facultyId: new ObjectId(validData.facultyId),
            departmentId: new ObjectId(validData.departmentId),
            password: hashedPassword, // Thay đổi mật khẩu thành mật khẩu đã băm
        }

        newTeacherToAdd._id = new ObjectId();


        const createdTeacher = await GET_DB().collection(TEACHER_COLLECTION_NAME).insertOne(newTeacherToAdd)
        
        await userModel.createUsersCollection({
            _id: newTeacherToAdd._id,
            email: data.email,
            username: data.username,
            password: hashedPassword,
            role: 'giangvien' // Xác định loại người dùng là giảng viên
            // Thêm các trường khác của giảng viên nếu cần
        });

        return createdTeacher
    } catch (error) {
        throw new Error(error.message); // Trả về thông báo lỗi từ MongoDB hoặc kiểm tra email
    }
}


const findOneById = async (teacherId) => {
    try {
        const result = await GET_DB().collection(TEACHER_COLLECTION_NAME).findOne({
            _id: new ObjectId(teacherId)
        })
        return result
    } catch (error) { throw new Error(error) }
}

const getAllTeachers = async () => {
    try {
        // Gọi phương thức từ MongoDB để lấy tất cả các khóa học
        const allTeachers = await GET_DB().collection(TEACHER_COLLECTION_NAME).find().toArray();
        // Trả về kết quả
        return allTeachers;
    } catch (error) {
        // Xử lý lỗi nếu có
        throw error;
    }
}

const getDetails = async (id) => {
    try {
        const result = await GET_DB().collection(TEACHER_COLLECTION_NAME).findOne({
            _id: new ObjectId(id)
        })
        return result
    } catch (error) { throw new Error(error) }
}

const deleteManyByTeacherId = async (departmentId) => {
    try {
        const result = await GET_DB().collection(TEACHER_COLLECTION_NAME).deleteMany({
            departmentId: new ObjectId(departmentId)
        })
        console.log('deleteManyByTeacherId - teacher', result)
        return result
    } catch (error) { throw new Error(error) }
}

const update = async (teacherId, updateData) => {
    try {
        Object.keys(updateData).forEach(fileName => {
            if (INVALID_UPDATE_FIELDS.includes(fileName)) {
                delete updateData[fileName]
            }
        })
        const result = await GET_DB().collection(TEACHER_COLLECTION_NAME).findOneAndUpdate(
            { _id: new ObjectId(teacherId) },
            { $set: updateData},
            { returnDocument: 'after' }
        );

        return result
    } catch (error) {
        throw new Error(error);
    }
}

const deleteOneById = async (teacherId) => {
    try {
        const teacherObjectId = new ObjectId(teacherId);

        const teacherToDelete = await findOneById(teacherObjectId);

        // Kiểm tra xem sinh viên có tồn tại không
        if (!teacherToDelete) {
            throw new Error('Teacher not found');
        }

        const result = await GET_DB().collection(TEACHER_COLLECTION_NAME).deleteOne({
            _id: teacherObjectId
        })
        console.log('deleteOneById - teacher', result)

        await userModel.deleteOneByUserId(teacherToDelete._id);
        return result
    } catch (error) { throw new Error(error) }
}

export const teacherModel = {
    TEACHER_COLLECTION_NAME,
    TEACHER_COLLECTION_SCHEMA,
    createNew,
    findOneById,
    getDetails,
    getAllTeachers,
    deleteManyByTeacherId,
    update,
    deleteOneById
}