/* eslint-disable no-useless-catch */
/* eslint-disable indent */
// Khóa học
import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { gradeModel } from './gradeModel'
import { studentModel } from './studentModel'

//Define Collection (Name & Schema)
const COURSE_COLLECTION_NAME = 'courses'
const COURSE_COLLECTION_SCHEMA = Joi.object({
    coursename: Joi.string().required().min(1).max(50).trim().strict(),
    coursedetail: Joi.string().required().min(1).max(50).trim().strict(),
    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null),
    _destroy: Joi.boolean().default(false)

})

const INVALID_UPDATE_FIELDS = ['_id', 'createdAt']

const validateBeforeCreate = async (data) => {
    return await COURSE_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
    try {
        const validData = await validateBeforeCreate(data)
        return await GET_DB().collection(COURSE_COLLECTION_NAME).insertOne(validData)
    } catch (error) { throw new Error(error) }
}

const findOneById = async (courseId) => {
    try {
        const result = await GET_DB().collection(COURSE_COLLECTION_NAME).findOne({
            _id: new ObjectId(courseId)
        })
        return result
    } catch (error) { throw new Error(error) }
}

const getAllCourses = async () => {
    try {
        const allCourses = await GET_DB().collection(COURSE_COLLECTION_NAME).find().toArray();
        return allCourses;
    } catch (error) {
        // Xử lý lỗi nếu có
        throw error;
    }
}

const getDetails = async (id) => {
    try {
        const result = await GET_DB().collection(COURSE_COLLECTION_NAME).aggregate([
            {
                $match: {
                    _id: new ObjectId(id),
                    _destroy: false
                }
            },
            {
                $lookup: {
                    from: gradeModel.GRADE_COLLECTION_NAME,
                    localField: '_id',
                    foreignField: 'courseId',
                    as: 'grades'
                }
            },
            {
                $lookup: {
                    from: studentModel.STUDENT_COLLECTION_NAME,
                    localField: '_id',
                    foreignField: 'courseId',
                    as: 'students'
                }
            }
        ]).toArray()
        return result[0] || {}
    } catch (error) { throw new Error(error) }
}

//Nhiệm vụ là push một giá trị ologyId và cuối mảng ologyOrderIds
const update = async (courseId, updateData) => {
    try {
        Object.keys(updateData).forEach(fileName => {
            if (INVALID_UPDATE_FIELDS.includes(fileName)) {
                delete updateData[fileName]
            }
        })
        const result = await GET_DB().collection(COURSE_COLLECTION_NAME).findOneAndUpdate(
            { _id: new ObjectId(courseId) },
            { $set: updateData},
            { returnDocument: 'after' }
        );

        return result
    } catch (error) {
        throw new Error(error);
    }
}

const deleteOneById = async (courseId) => {
    try {
        const result = await GET_DB().collection(COURSE_COLLECTION_NAME).deleteOne({
            _id: new ObjectId(courseId)
        })
        console.log('deleteOneById - course', result)
        return result
    } catch (error) { throw new Error(error) }
}


export const courseModel = {
    COURSE_COLLECTION_NAME,
    COURSE_COLLECTION_SCHEMA,
    createNew,
    findOneById,
    getDetails,
    getAllCourses,
    update,
    deleteOneById
}