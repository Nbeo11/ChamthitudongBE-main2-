/* eslint-disable no-useless-catch */
/* eslint-disable indent */
// Phòng đào tạo (user)
import bcrypt from 'bcrypt'
import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import createUsersCollection from './userModel'

//Define Collection (Name & Schema)
const TRANNING_DEPARTMENT_COLLECTION_NAME = 'tranning_departments'
const TRANNING_DEPARTMENT_COLLECTION_SCHEMA = Joi.object({
    username: Joi.string().required().min(1).max(5000).trim().strict(),
    password: Joi.string().required().min(1).max(5000).trim().strict(),
    birth: Joi.date().iso(),
    gender: Joi.string().valid('male', 'female', 'other'),
    phoneNumber: Joi.string().pattern(/^[0-9]{10,11}$/),
    email: Joi.string().email().required(),
    role: Joi.string().default('giangvien'), // Đặt giá trị mặc định là "giangvien"
    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null),
    _destroy: Joi.boolean().default(false)
})

const validateBeforeCreate = async (data) => {
    return await TRANNING_DEPARTMENT_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const hashPassword = async (password) => {
    const saltRounds = 10; // Số vòng lặp sử dụng cho thuật toán băm
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

const createNew = async (data) => {
    try {
        const validData = await validateBeforeCreate(data)

        const hashedPassword = await hashPassword(data.password);

        //Biến đổi một số dữ liệu liên quan tới OjectId chuẩn chỉnh
        const newTranning_departmentToAdd = {
            ...validData,
            password: hashedPassword, // Thay đổi mật khẩu thành mật khẩu đã băm
        }
        const createdTranning_department = await GET_DB().collection(TRANNING_DEPARTMENT_COLLECTION_NAME).insertOne(newTranning_departmentToAdd)
        
        await createUsersCollection({
            _id: createdTranning_department._id,
            username: data.username,
            password: hashedPassword,
            role: 'phongdaotao' // Xác định loại người dùng là sinh viên
            // Thêm các trường khác của sinh viên nếu cần
        });

        return createdTranning_department
    } catch (error) { throw new Error(error) }
}

const findOneById = async (tranning_departmentId) => {
    try {
        const result = await GET_DB().collection(TRANNING_DEPARTMENT_COLLECTION_NAME).findOne({
            _id: new ObjectId(tranning_departmentId)
        })
        return result
    } catch (error) { throw new Error(error) }
}

const getAllTranning_departments = async () => {
    try {
        // Gọi phương thức từ MongoDB để lấy tất cả các khóa học
        const allTranning_departments = await GET_DB().collection(TRANNING_DEPARTMENT_COLLECTION_NAME).find().toArray();
        // Trả về kết quả
        return allTranning_departments;
    } catch (error) {
        // Xử lý lỗi nếu có
        throw error;
    }
}

const getDetails = async (id) => {
    try {
        const result = await GET_DB().collection(TRANNING_DEPARTMENT_COLLECTION_NAME).findOne({
            _id: new ObjectId(id)
        })
        return result
    } catch (error) { throw new Error(error) }
}

const deleteManyByTranning_departmentId = async (departmentId) => {
    try {
        const result = await GET_DB().collection(TRANNING_DEPARTMENT_COLLECTION_NAME).deleteMany({
            departmentId: new ObjectId(departmentId)
        })
        console.log('deleteManyByTranning_departmentId - tranning_department', result)
        return result
    } catch (error) { throw new Error(error) }
}


export const tranning_departmentModel = {
    TRANNING_DEPARTMENT_COLLECTION_NAME,
    TRANNING_DEPARTMENT_COLLECTION_SCHEMA,
    createNew,
    findOneById,
    getDetails,
    getAllTranning_departments,
    deleteManyByTranning_departmentId
}