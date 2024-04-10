/* eslint-disable indent */
import Joi from 'joi';
import { GET_DB } from '~/config/mongodb';


const JOB_COLLECTION_NAME = 'jobs'
const JOB_COLLECTION_SCHEMA = Joi.object({
    language: Joi.string().valid('cpp', 'py').required(),
    filepath: Joi.string().required(),
    submittedAt: Joi.date().timestamp('javascript').default(Date.now),
    startedAt: Joi.date().timestamp('javascript').allow(null).default(null),
    completedAt: Joi.date().timestamp('javascript').allow(null).default(null),
    status: Joi.string().valid('pending', 'success', 'error').default('pending'),
    output: Joi.string().allow('').default('')
});
const validateBeforeCreate = async (data) => {
    return await JOB_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}


const createNew = async (data) => {
    try {
        const validData = await validateBeforeCreate(data)
        console.log('Valid data:', validData);

        //Biến đổi một số dữ liệu liên quan tới OjectId chuẩn chỉnh
        const newJobToAdd = {
            ...validData,
        }
        const createdJob = await GET_DB().collection(JOB_COLLECTION_NAME).insertOne(newJobToAdd)


        return createdJob
    } catch (error) { throw new Error(error) }
}
export const JobModel = {
    JOB_COLLECTION_NAME,
    JOB_COLLECTION_SCHEMA,
    createNew
}