/* eslint-disable indent */
/* eslint-disable no-useless-catch */
import Joi from 'joi';
import { ObjectId } from 'mongodb';
import { GET_DB } from '~/config/mongodb';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';

const TEST_COLLECTION_NAME = 'tests';

const TEST_COLLECTION_SCHEMA = Joi.object({
    requirement: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    input: Joi.array().items(Joi.string()).optional(),
    expectedOutput: Joi.array().items(Joi.string()).required(),
    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null),
});

const INVALID_UPDATE_FIELDS = ['_id', 'requirement', 'createdAt']

const validateBeforeCreate = async (data) => {
    return await TEST_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });
};

const createNew = async (data) => {
    try {
        const validData = await validateBeforeCreate(data);
        return await GET_DB().collection(TEST_COLLECTION_NAME).insertOne(validData);
    } catch (error) {
        throw new Error(error);
    }
};

const findOneById = async (testId) => {
    try {
        const result = await GET_DB().collection(TEST_COLLECTION_NAME).findOne({
            _id: new ObjectId(testId)
        })
        return result
    } catch (error) { throw new Error(error) }
}

const getAllTests = async () => {
    try {
        // Gọi phương thức từ MongoDB để lấy tất cả các khóa học
        const allTests = await GET_DB().collection(TEST_COLLECTION_NAME).find().toArray();
        // Trả về kết quả
        return allTests;
    } catch (error) {
        // Xử lý lỗi nếu có
        throw error;
    }
}

const getDetails = async (id) => {
    try {
        const result = await GET_DB().collection(TEST_COLLECTION_NAME).findOne({
            _id: new ObjectId(id)
        })
        return result
    } catch (error) { throw new Error(error) }
}

const update = async (testId, updateData) => {
    try {
        Object.keys(updateData).forEach(fileName => {
            if (INVALID_UPDATE_FIELDS.includes(fileName)) {
                delete updateData[fileName]
            }
        })
        const result = await GET_DB().collection(TEST_COLLECTION_NAME).findOneAndUpdate(
            { _id: new ObjectId(testId) },
            { $set: { ...updateData, updatedAt: new Date() } },
            { returnDocument: 'after' }
        );
        return result.value;
    } catch (error) {
        throw new Error(error);
    }
};

const deleteOneById = async (testId) => {
    try {
        const result = await GET_DB().collection(TEST_COLLECTION_NAME).deleteOne({
            _id: new ObjectId(testId)
        })
        console.log('deleteOneById - test', result)
        return result
    } catch (error) { throw new Error(error) }
}

export const testModel = {
    TEST_COLLECTION_NAME,
    TEST_COLLECTION_SCHEMA,
    createNew,
    getAllTests,
    update,
    getDetails,
    deleteOneById,
    findOneById
};
