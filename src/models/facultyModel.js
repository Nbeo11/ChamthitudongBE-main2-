/* eslint-disable no-useless-catch */
/* eslint-disable indent */
// Khoa
import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { departmentModel } from './departmentModel'
import { teacherModel } from './teacherModel'

//Define Collection (Name & Schema)
const FACULTY_COLLECTION_NAME = 'faculties'
const FACULTY_COLLECTION_SCHEMA = Joi.object({
    facultyname: Joi.string().required().min(1).max(5000).trim().strict(),
    // Lưu ý các item trong mảng columnOrderIds là ObjectId nên cần thêm pattern cho chuẩn
    departmentOrderIds: Joi.array().items(
        Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    ).default([]),
    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null),
    _destroy: Joi.boolean().default(false)

})

const INVALID_UPDATE_FIELDS = ['_id', 'createdAt']

const validateBeforeCreate = async (data) => {
    return await FACULTY_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
    try {
        const validData = await validateBeforeCreate(data)
        // const createdFaculty = await GET_DB().collection(FACULTY_COLLECTION_NAME).insertOne(data)
        // return createdFaculty
        return await GET_DB().collection(FACULTY_COLLECTION_NAME).insertOne(validData)
    } catch (error) { throw new Error(error) }
}

const findOneById = async (facultyId) => {
    try {
        const result = await GET_DB().collection(FACULTY_COLLECTION_NAME).findOne({
            _id: new ObjectId(facultyId)
        })
        return result
    } catch (error) { throw new Error(error) }
}

const getAllFaculties = async () => {
    try {
        // Gọi phương thức từ MongoDB để lấy tất cả các khóa học
        const allFaculties = await GET_DB().collection(FACULTY_COLLECTION_NAME).find().toArray();

        // Trả về kết quả
        return allFaculties;
    } catch (error) {
        // Xử lý lỗi nếu có
        throw error;
    }
}

const getDetails = async (id) => {
    try {
        // const result = await GET_DB().collection(FACULTY_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
        const result = await GET_DB().collection(FACULTY_COLLECTION_NAME).aggregate([
            {
                $match: {
                    _id: new ObjectId(id),
                    _destroy: false
                }
            },
            {
                $lookup: {
                    from: departmentModel.DEPARTMENT_COLLECTION_NAME,
                    localField: '_id',
                    foreignField: 'facultyId',
                    as: 'departments'
                }
            },
            {
                $lookup: {
                    from: teacherModel.TEACHER_COLLECTION_NAME,
                    localField: '_id',
                    foreignField: 'facultyId',
                    as: 'teachers'
                }
            }
        ]).toArray()
        return result[0] || {}
    } catch (error) { throw new Error(error) }
}

//Nhiệm vụ là push một giá trị departmentId và cuối mảng departmentOrderIds
const pushDepartmentOrderIds = async (department) => {
    try {
        const result = await GET_DB().collection(FACULTY_COLLECTION_NAME).findOneAndUpdate(
            { _id: new ObjectId(department.facultyId) },
            { $push: { departmentOrderIds: new ObjectId(department._id) } },
            { returnDocument: 'after' }
        )

        return result
    } catch (error) { throw new Error(error) }
}


// Lấy một phần tử ra khỏi mảng rồi xóa nó đi
const pullDepartmentOrderIds = async (department) => {
    try {
        const result = await GET_DB().collection(FACULTY_COLLECTION_NAME).findOneAndUpdate(
            { _id: new ObjectId(department.facultyId) },
            { $pull: { departmentOrderIds: new ObjectId(department._id) } },
            { returnDocument: 'after' }
        )

        return result
    } catch (error) { throw new Error(error) }
}

const update = async (facultyId, updateData) => {
    try {
        Object.keys(updateData).forEach(fileName => {
            if (INVALID_UPDATE_FIELDS.includes(fileName)) {
                delete updateData[fileName]
            }
        })
        const result = await GET_DB().collection(FACULTY_COLLECTION_NAME).findOneAndUpdate(
            { _id: new ObjectId(facultyId) },
            { $set: updateData},
            { returnDocument: 'after' }
        );

        return result
    } catch (error) {
        throw new Error(error);
    }
}

const deleteOneById = async (facultyId) => {
    try {
        const result = await GET_DB().collection(FACULTY_COLLECTION_NAME).deleteOne({
            _id: new ObjectId(facultyId)
        })
        console.log('deleteOneById - faculty', result)
        return result
    } catch (error) { throw new Error(error) }
}


export const facultyModel = {
    FACULTY_COLLECTION_NAME,
    FACULTY_COLLECTION_SCHEMA,
    createNew,
    findOneById,
    getDetails,
    getAllFaculties,
    pushDepartmentOrderIds,
    pullDepartmentOrderIds,
    update,
    deleteOneById
}