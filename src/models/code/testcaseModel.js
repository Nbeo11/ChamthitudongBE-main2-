/* eslint-disable indent */
import Joi from 'joi';
import { ObjectId } from 'mongodb';
import { GET_DB } from '~/config/mongodb';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';

const TESTCASE_COLLECTION_NAME = 'testcases';

const TESTCASE_COLLECTION_SCHEMA = Joi.object({
    codeId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    input: Joi.array().items(Joi.string()).required(),
    expectedOutput: Joi.array().items(Joi.string()).required(),
    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null),
});

const INVALID_UPDATE_FIELDS = ['_id', 'codeId', 'createdAt']

const validateBeforeCreate = async (data) => {
    return await TESTCASE_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });
};

const createNew = async (data) => {
    try {
        const validData = await validateBeforeCreate(data);
        return await GET_DB().collection(TESTCASE_COLLECTION_NAME).insertOne(validData);
    } catch (error) {
        throw new Error(error);
    }
};

const getTestCasesByCodeId = async (codeId) => {
    try {
        return await GET_DB().collection(TESTCASE_COLLECTION_NAME).find({ codeId }).toArray();
    } catch (error) {
        throw new Error(error);
    }
};

const updateTestCase = async (testCaseId, updateData) => {
    try {
        Object.keys(updateData).forEach(fileName => {
            if (INVALID_UPDATE_FIELDS.includes(fileName)) {
                delete updateData[fileName]
            }
        })
        const result = await GET_DB().collection(TESTCASE_COLLECTION_NAME).findOneAndUpdate(
            { _id: new ObjectId(testCaseId) },
            { $set: { ...updateData, updatedAt: new Date() } },
            { returnDocument: 'after' }
        );
        return result.value;
    } catch (error) {
        throw new Error(error);
    }
};


export const testcaseModel = {
    TESTCASE_COLLECTION_NAME,
    TESTCASE_COLLECTION_SCHEMA,
    createNew,
    getTestCasesByCodeId,
    updateTestCase
};
