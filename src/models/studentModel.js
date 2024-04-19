/* eslint-disable no-trailing-spaces */
/* eslint-disable no-useless-catch */
/* eslint-disable indent */
// Sinh viên (user)
import bcrypt from 'bcrypt'
import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { userModel } from './userModel'

//Define Collection (Name & Schema)
const STUDENT_COLLECTION_NAME = 'students'
const STUDENT_COLLECTION_SCHEMA = Joi.object({
    courseId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    ologyId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    gradeId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    username: Joi.string().required().min(1).max(5000).trim().strict(),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(1).max(5000).trim().strict(),
    birth: Joi.date().iso(),
    gender: Joi.string().valid('male', 'female', 'other'),
    phoneNumber: Joi.string().pattern(/^[0-9]{10,11}$/),
    role: Joi.string().default('sinhvien'), // Đặt giá trị mặc định là "sinhvien"
    note: Joi.string().min(0).max(5000).trim().strict(),
    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null),
    _destroy: Joi.boolean().default(false)
})
const INVALID_UPDATE_FIELDS = ['_id', 'courseId', 'ologyId', 'createdAt', 'email']
const validateBeforeCreate = async (data) => {
    return await STUDENT_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}
const hashPassword = async (password) => {
    const saltRounds = 10; // Số vòng lặp sử dụng cho thuật toán băm
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

const createNew = async (data) => {
    try {

        const existingUser = await GET_DB().collection(userModel.USER_COLLECTION_NAME).findOne({ email: data.email });
        if (existingUser) {
            throw new Error('Email already exists');
        }

        const validData = await validateBeforeCreate(data);

        // Băm mật khẩu trước khi lưu vào cơ sở dữ liệu
        const hashedPassword = await hashPassword(data.password);

        // Biến đổi một số dữ liệu liên quan tới OjectId chuẩn chỉnh
        const newStudentToAdd = {
            ...validData,
            courseId: new ObjectId(validData.courseId),
            ologyId: new ObjectId(validData.ologyId),
            gradeId: new ObjectId(validData.gradeId),
            password: hashedPassword, // Thay đổi mật khẩu thành mật khẩu đã băm
        }

        newStudentToAdd._id = new ObjectId();
        
        const createdStudent = await GET_DB().collection(STUDENT_COLLECTION_NAME).insertOne(newStudentToAdd);

        await userModel.createUsersCollection({
            _id: newStudentToAdd._id,
            email: data.email,
            username: data.username,
            password: hashedPassword, // Thay đổi mật khẩu thành mật khẩu đã băm
            role: 'sinhvien' // Xác định loại người dùng là sinh viên
            // Thêm các trường khác của sinh viên nếu cần
        });
        return createdStudent;
    } catch (error) {
        throw new Error(error);
    }
}

const findOneById = async (studentId) => {
    try {
        const result = await GET_DB().collection(STUDENT_COLLECTION_NAME).findOne({
            _id: new ObjectId(studentId)
        })
        return result
    } catch (error) { throw new Error(error) }
}


const getAllByGradeId = async (gradeId) => {
    try {
        // Lấy tất cả các student thuộc grade
        const result = await GET_DB().collection(STUDENT_COLLECTION_NAME).find({
            gradeId: new ObjectId(gradeId)
        }).toArray();
        return result;
    } catch (error) {
        // Xử lý lỗi nếu có
        throw error;
    }
}

const getAllStudents = async () => {
    try {
        // Gọi phương thức từ MongoDB để lấy tất cả các khóa học
        const allStudents = await GET_DB().collection(STUDENT_COLLECTION_NAME).find().toArray();
        // Trả về kết quả
        return allStudents;
    } catch (error) {
        // Xử lý lỗi nếu có
        throw error;
    }
}

const getDetails = async (id) => {
    try {
        const result = await GET_DB().collection(STUDENT_COLLECTION_NAME).findOne({
            _id: new ObjectId(id)
        })
        return result
    } catch (error) { throw new Error(error) }
}

const deleteManyByStudentId = async (gradeId) => {
    try {
        const result = await GET_DB().collection(STUDENT_COLLECTION_NAME).deleteMany({
            gradeId: new ObjectId(gradeId)
        })
        console.log('deleteManyByStudentId - student', result)
        return result
    } catch (error) { throw new Error(error) }
}


const update = async (studentId, updateData) => {
    try {
        Object.keys(updateData).forEach(fileName => {
            if (INVALID_UPDATE_FIELDS.includes(fileName)) {
                delete updateData[fileName]
            }
        })
        const result = await GET_DB().collection(STUDENT_COLLECTION_NAME).findOneAndUpdate(
            { _id: new ObjectId(studentId) },
            { $set: updateData},
            { returnDocument: 'after' }
        );

        return result
    } catch (error) {
        throw new Error(error);
    }
}

const deleteOneById = async (studentId) => {
    try {
        // Chuyển đổi studentId thành ObjectId
        const studentObjectId = new ObjectId(studentId);

        const studentToDelete = await findOneById(studentObjectId);

        // Kiểm tra xem sinh viên có tồn tại không
        if (!studentToDelete) {
            throw new Error('Student not found');
        }

        const result = await GET_DB().collection(STUDENT_COLLECTION_NAME).deleteOne({
            _id: studentObjectId
        })
        console.log('deleteOneById - student', result)

        await userModel.deleteOneByUserId(studentToDelete._id);
        return result
    } catch (error) { throw new Error(error) }
}



export const studentModel = {
    STUDENT_COLLECTION_NAME,
    STUDENT_COLLECTION_SCHEMA,
    createNew,
    findOneById,
    getDetails,
    getAllStudents,
    deleteManyByStudentId,
    update,
    deleteOneById,
    getAllByGradeId
}