/* eslint-disable no-useless-catch */
/* eslint-disable indent */
// Độ khó của câu hỏi
import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'

//Define Collection (Name & Schema)
const DIFFICULT_COLLECTION_NAME = 'difficults'
const DIFFICULT_COLLECTION_SCHEMA = Joi.object({
    difficulttype: Joi.string().required().min(1).max(50).trim().strict(),
    difficultdescription: Joi.string().required().min(1).max(50).trim().strict(),
    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null),
    _destroy: Joi.boolean().default(false)
})

const INVALID_UPDATE_FIELDS = ['_id', 'createdAt']

const validateBeforeCreate = async (data) => {
    return await DIFFICULT_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}


const createNew = async (data) => {
    try {
        const validData = await validateBeforeCreate(data)

        //Biến đổi một số dữ liệu liên quan tới OjectId chuẩn chỉnh
        const newDifficultToAdd = {
            ...validData,
        }
        const createdDifficult = await GET_DB().collection(DIFFICULT_COLLECTION_NAME).insertOne(newDifficultToAdd)


        return createdDifficult
    } catch (error) { throw new Error(error) }
}

const findOneById = async (difficultId) => {
    try {
        const result = await GET_DB().collection(DIFFICULT_COLLECTION_NAME).findOne({
            _id: new ObjectId(difficultId)
        })
        return result
    } catch (error) { throw new Error(error) }
}

const getAllDifficults = async () => {
    try {
        // Gọi phương thức từ MongoDB để lấy tất cả các khóa học
        const allDifficults = await GET_DB().collection(DIFFICULT_COLLECTION_NAME).find().toArray();
        // Trả về kết quả
        return allDifficults;
    } catch (error) {
        // Xử lý lỗi nếu có
        throw error;
    }
}

const getDetails = async (id) => {
    try {
        const result = await GET_DB().collection(DIFFICULT_COLLECTION_NAME).findOne({
            _id: new ObjectId(id)
        })
        return result
    } catch (error) { throw new Error(error) }
}

const deleteManyByDifficultId = async (departmentId) => {
    try {
        const result = await GET_DB().collection(DIFFICULT_COLLECTION_NAME).deleteMany({
            departmentId: new ObjectId(departmentId)
        })
        console.log('deleteManyByDifficultId - difficult', result)
        return result
    } catch (error) { throw new Error(error) }
}

const update = async (difficultId, updateData) => {
    try {
        Object.keys(updateData).forEach(fileName => {
            if (INVALID_UPDATE_FIELDS.includes(fileName)) {
                delete updateData[fileName]
            }
        })
        const result = await GET_DB().collection(DIFFICULT_COLLECTION_NAME).findOneAndUpdate(
            { _id: new ObjectId(difficultId) },
            { $set: updateData},
            { returnDocument: 'after' }
        );

        return result
    } catch (error) {
        throw new Error(error);
    }
}

const deleteOneById = async (difficultId) => {
    try {
        const result = await GET_DB().collection(DIFFICULT_COLLECTION_NAME).deleteOne({
            _id: new ObjectId(difficultId)
        })
        console.log('deleteOneById - difficult', result)
        return result
    } catch (error) { throw new Error(error) }
}

export const difficultModel = {
    DIFFICULT_COLLECTION_NAME,
    DIFFICULT_COLLECTION_SCHEMA,
    createNew,
    findOneById,
    getDetails,
    getAllDifficults,
    deleteManyByDifficultId,
    update,
    deleteOneById
}