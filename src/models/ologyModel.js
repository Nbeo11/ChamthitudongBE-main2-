/* eslint-disable no-useless-catch */
/* eslint-disable indent */
// Chuyên ngành học
import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { gradeModel } from './gradeModel'
import { studentModel } from './studentModel'

//Define Collection (Name & Schema)
const OLOGY_COLLECTION_NAME = 'ologies'
const OLOGY_COLLECTION_SCHEMA = Joi.object({
    courseId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    ologycode: Joi.string().required().min(1).max(50).trim().strict(),
    ologyname: Joi.string().required().min(1).max(50).trim().strict(),
    ologyshort: Joi.string().required().min(1).max(50).trim().strict(),
    ologydescription: Joi.string().required().min(1).max(50).trim().strict(),
    gradeOrderIds: Joi.array().items(
        Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    ).default([]),
    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null),
    _destroy: Joi.boolean().default(false)
})

const INVALID_UPDATE_FIELDS = ['_id', 'courseId', 'createdAt']

const validateBeforeCreate = async (data) => {
    return await OLOGY_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
    try {
        const validData = await validateBeforeCreate(data)
        const newOlogyToAdd = {
            ...validData,
            courseId: new ObjectId(validData.courseId)
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

const getAllByCourseId = async (courseId) => {
    try {
        // Lấy tất cả các ology thuộc course
        const result = await GET_DB().collection(OLOGY_COLLECTION_NAME).find({
            courseId: new ObjectId(courseId)
        }).toArray();
        return result;
    } catch (error) {
        throw new Error(error);
    }
}

const getDetails = async (id) => {
    try {
        const result = await GET_DB().collection(OLOGY_COLLECTION_NAME).aggregate([
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
                    foreignField: 'ologyId',
                    as: 'grades'
                }
            },
            {
                $lookup: {
                    from: studentModel.STUDENT_COLLECTION_NAME,
                    localField: '_id',
                    foreignField: 'ologyId',
                    as: 'students'
                }
            }
        ]).toArray()
        return result[0] || {}
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
    getAllByCourseId,
    pushGradeOrderIds,
    update,
    deleteOneById,
    deleteManyByOlogyId,
    pullGradeOrderIds
}