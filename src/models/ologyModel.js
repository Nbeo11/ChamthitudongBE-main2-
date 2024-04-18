/* eslint-disable no-useless-catch */
/* eslint-disable indent */
// Chuyên ngành học
import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'

//Define Collection (Name & Schema)
const OLOGY_COLLECTION_NAME = 'ologies'
const OLOGY_COLLECTION_SCHEMA = Joi.object({
    ologycode: Joi.string().required().min(1).max(50).trim().strict(),
    ologyname: Joi.string().required().min(1).max(50).trim().strict(),
    ologyshort: Joi.string().required().min(1).max(50).trim().strict(),
    ologydescription: Joi.string().required().min(1).max(50).trim().strict(),
    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null),
    _destroy: Joi.boolean().default(false)
})

const INVALID_UPDATE_FIELDS = ['_id', 'createdAt']

const validateBeforeCreate = async (data) => {
    return await OLOGY_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
    try {
        const validData = await validateBeforeCreate(data)
        const newOlogyToAdd = {
            ...validData,
        }
        const createdOlogy = await GET_DB().collection(OLOGY_COLLECTION_NAME).insertOne(newOlogyToAdd)
        return createdOlogy
        // return await GET_DB().collection(OLOGY_COLLECTION_NAME).insertOne(validData)
    } catch (error) { throw new Error(error) }
}

const findOneById = async (ologyId) => {
    try {
        const result = await GET_DB().collection(OLOGY_COLLECTION_NAME).findOne({
            _id: new ObjectId(ologyId)
        })
        return result
    } catch (error) { throw new Error(error) }
}


const getAllOlogies = async () => {
    try {
        // Gọi phương thức từ MongoDB để lấy tất cả các khóa học
        const allOlogies = await GET_DB().collection(OLOGY_COLLECTION_NAME).find().toArray();
        // Trả về kết quả
        return allOlogies;
    } catch (error) {
        // Xử lý lỗi nếu có
        throw error;
    }
}

const getDetails = async (id) => {
    try {
        const result = await GET_DB().collection(OLOGY_COLLECTION_NAME).findOne({
            _id: new ObjectId(id)
        })
        return result
    } catch (error) { throw new Error(error) }
}

const pushGradeOrderIds = async (grade) => {
    try {
        const result = await GET_DB().collection(OLOGY_COLLECTION_NAME).findOneAndUpdate(
        { _id: new ObjectId(grade.ologyId) },
        { $push: { gradeOrderIds: new ObjectId(grade._id) } },
        { returnDocument: 'after' }
        )

        return result
    } catch (error) { throw new Error(error) }
}

const update = async (ologyId, updateData) => {
    try {
        Object.keys(updateData).forEach(fileName => {
            if (INVALID_UPDATE_FIELDS.includes(fileName)) {
                delete updateData[fileName]
            }
        })
        const result = await GET_DB().collection(OLOGY_COLLECTION_NAME).findOneAndUpdate(
            { _id: new ObjectId(ologyId) },
            { $set: updateData},
            { returnDocument: 'after' }
        );

        return result
    } catch (error) {
        throw new Error(error);
    }
}

const deleteOneById = async (ologyId) => {
    try {
        const result = await GET_DB().collection(OLOGY_COLLECTION_NAME).deleteOne({
            _id: new ObjectId(ologyId)
        })
        console.log('deleteOneById - ology', result)
        return result
    } catch (error) { throw new Error(error) }
}

const deleteManyByOlogyId = async (courseId) => {
    try {
        const result = await GET_DB().collection(OLOGY_COLLECTION_NAME).deleteMany({
            courseId: new ObjectId(courseId)
        })
        console.log('deleteManyByOlogyId - ology', result)
        return result
    } catch (error) { throw new Error(error) }
}

const pullGradeOrderIds = async (grade) => {
    try {
        const result = await GET_DB().collection(OLOGY_COLLECTION_NAME).findOneAndUpdate(
            { _id: new ObjectId(grade.ologyId) },
            { $pull: { gradeOrderIds: new ObjectId(grade._id) } },
            { returnDocument: 'after' }
        )

        return result
    } catch (error) { throw new Error(error) }
}

export const ologyModel = {
    OLOGY_COLLECTION_NAME,
    OLOGY_COLLECTION_SCHEMA,
    createNew,
    findOneById,
    getDetails,
    pushGradeOrderIds,
    update,
    deleteOneById,
    deleteManyByOlogyId,
    pullGradeOrderIds,
    getAllOlogies
}