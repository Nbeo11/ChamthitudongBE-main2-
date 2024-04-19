/* eslint-disable no-useless-catch */
/* eslint-disable indent */
// Bộ môn
import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { teacherModel } from './teacherModel'

//Define Collection (Name & Schema)
const DEPARTMENT_COLLECTION_NAME = 'departments'
const DEPARTMENT_COLLECTION_SCHEMA = Joi.object({
    facultyId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    departmentname: Joi.string().required().min(1).max(5000).trim().strict(),
    teacherOrderIds: Joi.array().items(
        Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    ).default([]),
    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null),
    _destroy: Joi.boolean().default(false)
})

const INVALID_UPDATE_FIELDS = ['_id', 'facultyId', 'createdAt']

const validateBeforeCreate = async (data) => {
    return await DEPARTMENT_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
    try {
        const validData = await validateBeforeCreate(data)
        const newDepartmentToAdd = {
            ...validData,
            facultyId: new ObjectId(validData.facultyId)
        }
        const createdDepartment = await GET_DB().collection(DEPARTMENT_COLLECTION_NAME).insertOne(newDepartmentToAdd)
        return createdDepartment
        // return await GET_DB().collection(DEPARTMENT_COLLECTION_NAME).insertOne(validData)
    } catch (error) { throw new Error(error) }
}

const findOneById = async (departmentId) => {
    try {
        const result = await GET_DB().collection(DEPARTMENT_COLLECTION_NAME).findOne({
            _id: new ObjectId(departmentId)
        })
        return result
    } catch (error) { throw new Error(error) }
}

const getAllByFacultyId = async (facultyId) => {
    try {
        // Lấy tất cả các department thuộc faculty
        const result = await GET_DB().collection(DEPARTMENT_COLLECTION_NAME).find({
            facultyId: new ObjectId(facultyId)
        }).toArray();
        return result;
    } catch (error) {
        throw new Error(error);
    }
}

const getDetails = async (id) => {
    try {
        const result = await GET_DB().collection(DEPARTMENT_COLLECTION_NAME).aggregate([
            {
                $match: {
                    _id: new ObjectId(id),
                    _destroy: false
                }
            },
            {
                $lookup: {
                    from: teacherModel.TEACHER_COLLECTION_NAME,
                    localField: '_id',
                    foreignField: 'departmentId',
                    as: 'teachers'
                }
            }
        ]).toArray()
        return result[0] || {}
    } catch (error) { throw new Error(error) }
}

const pushTeacherOrderIds = async (teacher) => {
    try {
        const result = await GET_DB().collection(DEPARTMENT_COLLECTION_NAME).findOneAndUpdate(
        { _id: new ObjectId(teacher.departmentId) },
        { $push: { teacherOrderIds: new ObjectId(teacher._id) } },
        { returnDocument: 'after' }
        )

        return result
    } catch (error) { throw new Error(error) }
}

const update = async (departmentId, updateData) => {
    try {
        Object.keys(updateData).forEach(fileName => {
            if (INVALID_UPDATE_FIELDS.includes(fileName)) {
                delete updateData[fileName]
            }
        })
        const result = await GET_DB().collection(DEPARTMENT_COLLECTION_NAME).findOneAndUpdate(
            { _id: new ObjectId(departmentId) },
            { $set: updateData},
            { returnDocument: 'after' }
        );

        return result
    } catch (error) {
        throw new Error(error);
    }
}

const deleteOneById = async (departmentId) => {
    try {
        const result = await GET_DB().collection(DEPARTMENT_COLLECTION_NAME).deleteOne({
            _id: new ObjectId(departmentId)
        })
        console.log('deleteOneById - department', result)
        return result
    } catch (error) { throw new Error(error) }
}

const deleteManyByDepartmentId = async (facultyId) => {
    try {
        const result = await GET_DB().collection(DEPARTMENT_COLLECTION_NAME).deleteMany({
            facultyId: new ObjectId(facultyId)
        })
        console.log('deleteManyByDepartmentId - department', result)
        return result
    } catch (error) { throw new Error(error) }
}


export const departmentModel = {
    DEPARTMENT_COLLECTION_NAME,
    DEPARTMENT_COLLECTION_SCHEMA,
    createNew,
    findOneById,
    getDetails,
    getAllByFacultyId,
    pushTeacherOrderIds,
    update,
    deleteOneById,
    deleteManyByDepartmentId
}